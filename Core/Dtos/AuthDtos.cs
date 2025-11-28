namespace Core.Dtos;

public record RegisterDto(string Name, string Email, string Password);
public record LoginDto(string Email, string Password);
public record TokenResponse(string AccessToken, string RefreshToken);
public record RefreshTokenRequest(string RefreshToken);