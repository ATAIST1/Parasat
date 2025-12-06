using BCrypt.Net;
using Core.Dtos;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Google.Apis.Auth;

namespace Application.Services;

public class AuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IConfiguration _config;
    private readonly EmailService _emailService;

    public AuthService(IUserRepository userRepo, IConfiguration config, EmailService emailService)
    {
        _userRepo = userRepo;
        _config = config;
        _emailService = emailService;
    }

    public async Task<Core.Models.User?> RegisterAsync(RegisterDto dto)
    {
    // Проверка пароля  я добавила ес чо удалим
    var password = dto.Password ?? string.Empty;

    // минимум 8 символов
    if (password.Length < 8
        // хотя бы одна заглавная
        || !password.Any(char.IsUpper)
        // хотя бы один спецсимвол из набора
        || !password.Any(ch => "!@#$%^&*()_+-=[]{};':\",.<>?/.".Contains(ch)))
    {
        throw new Exception("Пароль должен содержать минимум 8 символов, одну заглавную букву и один специальный символ");
    }



        var existing = await _userRepo.GetByEmailAsync(dto.Email);
        if (existing != null) throw new Exception("Пользователь с таким email уже зарегистрирован");

        var confirmToken = Guid.NewGuid().ToString();

        var user = new Core.Models.User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Email.EndsWith("@admin.com") ? "Admin" : "User",
            EmailConfirmationToken = confirmToken,
            EmailConfirmationTokenExpires = DateTime.UtcNow.AddHours(1)
        };

        await _userRepo.AddAsync(user);
        await _emailService.SendConfirmationEmailAsync(dto.Email, confirmToken);
        return user;
    }

    public async Task<TokenResponse> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials");

        if (!user.EmailConfirmed)
            throw new UnauthorizedAccessException("Email not confirmed. Check your inbox.");

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokens ??= new List<string>();
        user.RefreshTokens.Add(refreshToken);

        await _userRepo.UpdateAsync(user);

        return new TokenResponse(accessToken, refreshToken);
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            throw new SecurityTokenException("Refresh token is required");

        // 1. Find user by refresh token
        var user = await _userRepo.GetByRefreshTokenAsync(request.RefreshToken);
        if (user == null)
            throw new SecurityTokenException("Invalid or expired refresh token");

        // 2. Generate new tokens
        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        // 3. Rotate refresh token
        user.RefreshTokens!.Remove(request.RefreshToken);
        user.RefreshTokens.Add(newRefreshToken);
        await _userRepo.UpdateAsync(user);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    private string GenerateJwtToken(Core.Models.User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(15),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var random = new byte[64];
        RandomNumberGenerator.Fill(random);
        return Convert.ToBase64String(random);
    }

    private ClaimsPrincipal ValidateJwtToken(string token)
    {
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);
        var handler = new JwtSecurityTokenHandler();

        handler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        }, out var validatedToken);

        return handler.ValidateToken(token, new TokenValidationParameters(), out validatedToken);
    }

    public async Task<TokenResponse> LoginWithGoogleAsync(GoogleLoginDto dto)
    {
        var clientId = _config["Google:ClientId"]
            ?? throw new InvalidOperationException("Google ClientId not configured");

        var payload = await GoogleJsonWebSignature.ValidateAsync(
            dto.IdToken,
            new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            });

        var user = await _userRepo.GetByEmailAsync(payload.Email);
        if (user == null)
        {
            user = new Core.Models.User
            {
                Name = payload.Name,
                Email = payload.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                    Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                ),
                Role = "User",
                EmailConfirmed = true // Google-логин → можно считать подтверждённым
            };
            await _userRepo.AddAsync(user);
        }

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokens ??= new List<string>();
        user.RefreshTokens.Add(refreshToken);
        await _userRepo.UpdateAsync(user);

        return new TokenResponse(accessToken, refreshToken);
    }

    public async Task LogoutAsync(string userId, string? refreshToken = null)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new UnauthorizedAccessException("User not found");

        if (user.RefreshTokens == null || user.RefreshTokens.Count == 0)
        {
            if (!string.IsNullOrWhiteSpace(refreshToken))
            {
                throw new UnauthorizedAccessException("Refresh token not found or already invalidated");
            }
            return;
        }

        if (!string.IsNullOrWhiteSpace(refreshToken))
        {

            if (!user.RefreshTokens.Contains(refreshToken))
            {
                throw new UnauthorizedAccessException("Refresh token not found or already invalidated");
            }
            
            // удалить конкретный refresh token
            user.RefreshTokens.Remove(refreshToken);
        }
        else
        {
            // удалить все refresh tokens (выйти из всех устройств)
            user.RefreshTokens.Clear();
        }

        await _userRepo.UpdateAsync(user);
    }
}
