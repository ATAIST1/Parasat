using BCrypt.Net;
using Core.Dtos;
using Core.Interfaces;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Application.Services;

public class AuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IConfiguration _config;
    private readonly EmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepo,
        IConfiguration config,
        EmailService emailService,
        ILogger<AuthService> logger)
    {
        _userRepo = userRepo;
        _config = config;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<Core.Models.User?> RegisterAsync(RegisterDto dto)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "register",
            ["email"] = dto.Email
        });

        _logger.LogInformation("Register attempt");

        // Password validation
        var password = dto.Password ?? string.Empty;
        if (password.Length < 8
            || !password.Any(char.IsUpper)
            || !password.Any(ch => "!@#$%^&*()_+-=[]{};':\",.<>?/.".Contains(ch)))
        {
            _logger.LogWarning("Register failed: password policy violation");
            throw new Exception("Пароль должен содержать минимум 8 символов, одну заглавную букву и один специальный символ");
        }

        var existing = await _userRepo.GetByEmailAsync(dto.Email);
        if (existing != null)
        {
            _logger.LogWarning("Register failed: email already exists");
            throw new Exception("Пользователь с таким email уже зарегистрирован");
        }

        var confirmToken = Guid.NewGuid().ToString();

        var user = new Core.Models.User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "User",
            EmailConfirmationToken = confirmToken,
            EmailConfirmationTokenExpires = DateTime.UtcNow.AddHours(1)
        };

        await _userRepo.AddAsync(user);
        _logger.LogInformation("User created userId={UserId}", user.Id);

        try
        {
            await _emailService.SendConfirmationEmailAsync(dto.Email, confirmToken);
            _logger.LogInformation("Confirmation email queued/sent");
        }
        catch (Exception ex)
        {
            // IMPORTANT: do not log tokens
            _logger.LogError(ex, "Failed to send confirmation email");
            throw;
        }

        _logger.LogInformation("Register success");
        return user;
    }

    public async Task<LoginResponse> LoginAsync(LoginDto dto)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "login",
            ["email"] = dto.Email
        });

        _logger.LogInformation("Login attempt");

        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null)
        {
            _logger.LogWarning("Login failed: user not found");
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        using var userScope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["userId"] = user.Id
        });

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed: wrong password");
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        if (IsUserBanned(user))
        {
            _logger.LogWarning("Login blocked: user banned bannedUntil={BannedUntil}", user.BannedUntil);
            throw new UnauthorizedAccessException("User is banned");
        }

        if (!user.EmailConfirmed)
        {
            _logger.LogWarning("Login blocked: email not confirmed");
            throw new UnauthorizedAccessException("Email not confirmed. Check your inbox.");
        }

        // If 2FA disabled => issue tokens immediately
        if (!user.IsTwoFactorEnabled)
        {
            _logger.LogInformation("Login success: 2FA disabled, issuing tokens");

            var accessToken = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            user.RefreshTokenHashes ??= new();
            user.RefreshTokenHashes.Add(HashToken(refreshToken));

            await _userRepo.UpdateAsync(user);
            _logger.LogInformation("Refresh token stored (hashed), login completed");

            return new LoginResponse(
                RequiresTwoFactor: false,
                AccessToken: accessToken,
                RefreshToken: refreshToken,
                TemporaryToken: null,
                Role: user.Role,
                Id: user.Id
            );
        }

        // 2FA enabled: generate and send code
        _logger.LogInformation("2FA required: generating one-time code and temp session");

        var code = GenerateOneTimeCode();

        user.TwoFactorCodeHash = BCrypt.Net.BCrypt.HashPassword(code);
        user.TwoFactorCodeExpiresAt = DateTime.UtcNow.AddMinutes(10);
        user.TwoFactorTempToken = Guid.NewGuid().ToString();

        await _userRepo.UpdateAsync(user);
        _logger.LogInformation("2FA session persisted expiresAt={ExpiresAt}", user.TwoFactorCodeExpiresAt);

        try
        {
            await _emailService.SendTwoFactorCodeEmailAsync(user.Email, code);
            _logger.LogInformation("2FA email queued/sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send 2FA email");
            throw;
        }

        return new LoginResponse(
            RequiresTwoFactor: true,
            AccessToken: null,
            RefreshToken: null,
            TemporaryToken: user.TwoFactorTempToken,
            Role: user.Role,
            Id: user.Id
        );
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "refresh"
        });

        _logger.LogInformation("Refresh attempt");

        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            _logger.LogWarning("Refresh failed: missing refresh token");
            throw new SecurityTokenException("Refresh token is required");
        }

        var hash = HashToken(request.RefreshToken);

        var user = await _userRepo.GetByRefreshTokenHashAsync(hash);
        if (user == null)
        {
            _logger.LogWarning("Refresh failed: invalid refresh token");
            throw new SecurityTokenException("Invalid or expired refresh token");
        }

        using var userScope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["userId"] = user.Id
        });

        if (IsUserBanned(user))
        {
            _logger.LogWarning("Refresh blocked: user banned bannedUntil={BannedUntil}", user.BannedUntil);
            throw new UnauthorizedAccessException("User is banned");
        }

        _logger.LogInformation("Refresh token valid: issuing new tokens");

        var newAccessToken = GenerateJwtToken(user);

        // rotate refresh token
        user.RefreshTokenHashes!.Remove(hash);
        var newRefresh = GenerateRefreshToken();
        user.RefreshTokenHashes.Add(HashToken(newRefresh));

        await _userRepo.UpdateAsync(user);
        _logger.LogInformation("Refresh rotation completed");

        return new TokenResponse(newAccessToken, newRefresh);
    }

    public async Task<TokenResponse> LoginWithGoogleAsync(GoogleLoginDto dto)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "google_login"
        });

        _logger.LogInformation("Google login attempt");

        var clientId = _config["Google:ClientId"]
            ?? throw new InvalidOperationException("Google ClientId not configured");

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(
                dto.IdToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                });

            _logger.LogInformation("Google token validated email={Email}", payload.Email);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Google token validation failed");
            throw;
        }

        var user = await _userRepo.GetByEmailAsync(payload.Email);
        if (user == null)
        {
            _logger.LogInformation("Google user not found: creating account email={Email}", payload.Email);

            user = new Core.Models.User
            {
                Name = payload.Name,
                Email = payload.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                    Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                ),
                Role = "User",
                EmailConfirmed = true
            };

            await _userRepo.AddAsync(user);
            _logger.LogInformation("Google user created userId={UserId}", user.Id);
        }

        using var userScope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["userId"] = user.Id,
            ["email"] = user.Email
        });

        if (IsUserBanned(user))
        {
            _logger.LogWarning("Google login blocked: user banned bannedUntil={BannedUntil}", user.BannedUntil);
            throw new UnauthorizedAccessException("User is banned");
        }

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokenHashes ??= new();
        user.RefreshTokenHashes.Add(HashToken(refreshToken));

        await _userRepo.UpdateAsync(user);

        _logger.LogInformation("Google login success: tokens issued");
        return new TokenResponse(accessToken, refreshToken);
    }

    public async Task LogoutAsync(string userId, string? refreshToken = null)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "logout",
            ["userId"] = userId
        });

        _logger.LogInformation("Logout attempt");

        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("Logout failed: user not found");
            throw new UnauthorizedAccessException("User not found");
        }

        user.RefreshTokenHashes ??= new List<string>();

        if (!string.IsNullOrWhiteSpace(refreshToken))
        {
            var hash = HashToken(refreshToken);

            if (!user.RefreshTokenHashes.Contains(hash))
            {
                _logger.LogWarning("Logout failed: refresh token not found");
                throw new UnauthorizedAccessException("Refresh token not found or already invalidated");
            }

            user.RefreshTokenHashes.Remove(hash);
            _logger.LogInformation("Logout: single refresh token removed");
        }
        else
        {
            var count = user.RefreshTokenHashes.Count;
            user.RefreshTokenHashes.Clear();
            _logger.LogInformation("Logout: cleared all refresh tokens count={Count}", count);
        }

        await _userRepo.UpdateAsync(user);
        _logger.LogInformation("Logout success");
    }

    public async Task ResendConfirmationEmailAsync(ResendConfirmationDto dto)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "resend_confirmation",
            ["email"] = dto.Email
        });

        _logger.LogInformation("Resend confirmation attempt");

        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null)
        {
            _logger.LogWarning("Resend confirmation failed: user not found");
            throw new Exception("Пользователь с таким email не найден");
        }

        using var userScope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["userId"] = user.Id
        });

        if (user.EmailConfirmed)
        {
            _logger.LogInformation("Resend confirmation skipped: already confirmed");
            throw new Exception("Email уже подтверждён");
        }

        var confirmToken = Guid.NewGuid().ToString();
        user.EmailConfirmationToken = confirmToken;
        user.EmailConfirmationTokenExpires = DateTime.UtcNow.AddHours(1);

        await _userRepo.UpdateAsync(user);
        _logger.LogInformation("New confirmation token generated (not logged) expiresAt={ExpiresAt}", user.EmailConfirmationTokenExpires);

        try
        {
            await _emailService.SendConfirmationEmailAsync(dto.Email, confirmToken);
            _logger.LogInformation("Confirmation email queued/sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to resend confirmation email");
            throw;
        }
    }

    public async Task ChangePasswordAsync(string userId, ChangePasswordDto dto)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "change_password",
            ["userId"] = userId
        });

        _logger.LogInformation("Change password attempt");

        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("Change password failed: user not found");
            throw new UnauthorizedAccessException("User not found");
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
        {
            _logger.LogWarning("Change password failed: current password incorrect");
            throw new UnauthorizedAccessException("Current password is incorrect");
        }

        var newPassword = dto.NewPassword ?? string.Empty;
        if (newPassword.Length < 8
            || !newPassword.Any(char.IsUpper)
            || !newPassword.Any(ch => "!@#$%^&*()_+-=[]{};':\",.<>?/.".Contains(ch)))
        {
            _logger.LogWarning("Change password failed: password policy violation");
            throw new Exception("Пароль должен содержать минимум 8 символов, одну заглавную букву и один специальный символ");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _userRepo.UpdateAsync(user);

        _logger.LogInformation("Change password success");
    }

    public async Task<TokenResponse> VerifyTwoFactorAsync(TwoFactorVerifyDto dto)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "verify_2fa"
        });

        if (string.IsNullOrWhiteSpace(dto.TemporaryToken))
        {
            _logger.LogWarning("2FA verify failed: missing temp token");
            throw new UnauthorizedAccessException("Invalid 2FA session");
        }

        _logger.LogInformation("2FA verify attempt");

        var user = await _userRepo.GetByTwoFactorTempTokenAsync(dto.TemporaryToken);
        if (user == null)
        {
            _logger.LogWarning("2FA verify failed: session not found/expired");
            throw new UnauthorizedAccessException("Invalid or expired 2FA session");
        }

        using var userScope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["userId"] = user.Id,
            ["email"] = user.Email
        });

        if (IsUserBanned(user))
        {
            _logger.LogWarning("2FA verify blocked: user banned bannedUntil={BannedUntil}", user.BannedUntil);
            throw new UnauthorizedAccessException("User is banned");
        }

        if (user.TwoFactorCodeHash == null || user.TwoFactorCodeExpiresAt == null)
        {
            _logger.LogWarning("2FA verify failed: code not generated");
            throw new UnauthorizedAccessException("2FA code not generated");
        }

        if (user.TwoFactorCodeExpiresAt < DateTime.UtcNow)
        {
            _logger.LogWarning("2FA verify failed: code expired expiresAt={ExpiresAt}", user.TwoFactorCodeExpiresAt);
            throw new UnauthorizedAccessException("2FA code expired");
        }

        var isValid = BCrypt.Net.BCrypt.Verify(dto.Code, user.TwoFactorCodeHash);
        if (!isValid)
        {
            _logger.LogWarning("2FA verify failed: invalid code");
            throw new UnauthorizedAccessException("Invalid 2FA code");
        }

        _logger.LogInformation("2FA verify success: issuing tokens and clearing 2FA state");

        user.TwoFactorCodeHash = null;
        user.TwoFactorCodeExpiresAt = null;
        user.TwoFactorTempToken = null;

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokenHashes ??= new();
        user.RefreshTokenHashes.Add(HashToken(refreshToken));

        await _userRepo.UpdateAsync(user);

        _logger.LogInformation("2FA login completed");
        return new TokenResponse(accessToken, refreshToken);
    }

    public async Task ToggleTwoFactorAsync(string userId, bool enabled)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "toggle_2fa",
            ["userId"] = userId,
            ["enabled"] = enabled
        });

        _logger.LogInformation("Toggle 2FA attempt");

        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new Exception("User not found");

        user.IsTwoFactorEnabled = enabled;

        if (!enabled)
        {
            user.TwoFactorCodeHash = null;
            user.TwoFactorCodeExpiresAt = null;
            user.TwoFactorTempToken = null;
            _logger.LogInformation("2FA disabled: cleared pending 2FA state");
        }
        else
        {
            _logger.LogInformation("2FA enabled");
        }

        await _userRepo.UpdateAsync(user);
        _logger.LogInformation("Toggle 2FA success");
    }

    public async Task RequestPasswordResetAsync(ForgotPasswordDto dto)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "request_password_reset",
            ["email"] = dto.Email
        });

        _logger.LogInformation("Password reset requested");

        var user = await _userRepo.GetByEmailAsync(dto.Email);

        // security: do not reveal existence of email
        if (user == null)
        {
            _logger.LogInformation("Password reset request: user not found (silently ignored)");
            return;
        }

        using var userScope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["userId"] = user.Id
        });

        var token = Guid.NewGuid().ToString();

        user.PasswordResetToken = token;
        user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1);

        await _userRepo.UpdateAsync(user);
        _logger.LogInformation("Password reset token generated (not logged) expiresAt={ExpiresAt}", user.PasswordResetTokenExpires);

        try
        {
            await _emailService.SendPasswordResetEmailAsync(user.Email, token);
            _logger.LogInformation("Password reset email queued/sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset email");
            throw;
        }
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "reset_password",
            ["email"] = dto.Email
        });

        _logger.LogInformation("Reset password attempt");

        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null)
        {
            _logger.LogWarning("Reset password failed: user not found");
            throw new UnauthorizedAccessException("Invalid reset token");
        }

        using var userScope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["userId"] = user.Id
        });

        if (string.IsNullOrEmpty(user.PasswordResetToken) ||
            user.PasswordResetToken != dto.Token ||
            user.PasswordResetTokenExpires == null ||
            user.PasswordResetTokenExpires < DateTime.UtcNow)
        {
            _logger.LogWarning("Reset password failed: invalid/expired token expiresAt={ExpiresAt}", user.PasswordResetTokenExpires);
            throw new UnauthorizedAccessException("Invalid or expired reset token");
        }

        var newPassword = dto.NewPassword ?? string.Empty;

        if (newPassword.Length < 8
            || !newPassword.Any(char.IsUpper)
            || !newPassword.Any(ch => "!@#$%^&*()_+-=[]{};':\",.<>?/.".Contains(ch)))
        {
            _logger.LogWarning("Reset password failed: password policy violation");
            throw new Exception("Пароль должен содержать минимум 8 символов, одну заглавную букву и один специальный символ");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

        user.PasswordResetToken = null;
        user.PasswordResetTokenExpires = null;

        // invalidate all refresh tokens
        var oldCount = user.RefreshTokenHashes?.Count ?? 0;
        user.RefreshTokenHashes = new List<string>();

        await _userRepo.UpdateAsync(user);

        _logger.LogInformation("Reset password success: invalidated refresh tokens count={Count}", oldCount);
    }

    // ===== Helpers =====

    private string GenerateJwtToken(Core.Models.User user)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object?>
        {
            ["op"] = "jwt_issue",
            ["userId"] = user.Id
        });

        var jwtKey = _config["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            _logger.LogCritical("JWT Key not configured");
            throw new InvalidOperationException("JWT Key not configured");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var expires = DateTime.UtcNow.AddMinutes(15);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        _logger.LogDebug("JWT created expiresAt={ExpiresAt}", expires);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var random = new byte[64];
        RandomNumberGenerator.Fill(random);
        return Convert.ToBase64String(random);
    }

    // NOTE: currently unused in your code; left as-is but fixed to avoid double-validate.
    private ClaimsPrincipal ValidateJwtToken(string token)
    {
        var keyStr = _config["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(keyStr))
            throw new InvalidOperationException("JWT Key not configured");

        var key = Encoding.UTF8.GetBytes(keyStr);
        var handler = new JwtSecurityTokenHandler();

        var principal = handler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        }, out _);

        return principal;
    }

    private static string GenerateOneTimeCode()
    {
        var bytes = new byte[4];
        RandomNumberGenerator.Fill(bytes);
        var value = BitConverter.ToUInt32(bytes, 0) % 900000 + 100000;
        return value.ToString();
    }

    private static bool IsUserBanned(Core.Models.User u) =>
        u.IsBanned && (u.BannedUntil == null || u.BannedUntil > DateTime.UtcNow);

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }
}
