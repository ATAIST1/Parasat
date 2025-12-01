using BCrypt.Net;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;
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

    public AuthService(IUserRepository userRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _config = config;
    }

    public async Task<User?> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userRepo.GetByEmailAsync(dto.Email);
        if (existing != null) throw new Exception("Email already exists");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Email.EndsWith("@admin.com") ? "Admin" : "User" // временно для теста
        };

        await _userRepo.AddAsync(user);
        return user;
    }

    public async Task<TokenResponse> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials");

        var accessToken = GenerateJwtToken(user!);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokens ??= new List<string>();
        user.RefreshTokens.Add(refreshToken);

        await _userRepo.UpdateAsync(user);   // ← ЭТА СТРОКА ВСЁ ИСПРАВИТ

        return new TokenResponse(accessToken, refreshToken);
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            throw new SecurityTokenException("Refresh token is required");

        // 1. Ищем пользователя, у которого в списке есть этот refresh-токен
        var user = await _userRepo.GetByRefreshTokenAsync(request.RefreshToken);
        if (user == null)
            throw new SecurityTokenException("Invalid or expired refresh token");

        // 2. Генерируем новые токены
        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        // 3. Удаляем старый и добавляем новый
        user.RefreshTokens!.Remove(request.RefreshToken);
        user.RefreshTokens.Add(newRefreshToken);
        await _userRepo.UpdateAsync(user);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }
    private string GenerateJwtToken(User user)
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

        // Валидируем Google-токен
        var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(dto.IdToken, new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { clientId }
        });

        // Ищем или создаём пользователя по email
        var user = await _userRepo.GetByEmailAsync(payload.Email);
        if (user == null)
        {
            user = new User
            {
                Name = payload.Name,
                Email = payload.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                    Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                ), // рандомный хеш
                Role = "User"
            };
            await _userRepo.AddAsync(user);
        }

        // Выдаём твои JWT-токены
        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokens ??= new List<string>();
        user.RefreshTokens.Add(refreshToken);
        await _userRepo.UpdateAsync(user);

        return new TokenResponse(accessToken, refreshToken);
    }
}