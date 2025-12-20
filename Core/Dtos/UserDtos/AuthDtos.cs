namespace Core.Dtos;

public record RegisterDto(string Name, string Email, string Password);
public record LoginDto(string Email, string Password);

// НОВОЕ: ответ на логин с поддержкой 2FA
public record LoginResponse(
    bool RequiresTwoFactor,
    string? AccessToken,
    string? RefreshToken,
    string? TemporaryToken,
    string? Role,
    string? Id = null
);

public record TokenResponse(string AccessToken, string RefreshToken, string? Id = null, string? Role = null);
public record RefreshTokenRequest(string RefreshToken);
public record LogoutDto(string? RefreshToken = null);
public record ResendConfirmationDto(string Email);
public record ChangePasswordDto(string CurrentPassword, string NewPassword);

// НОВОЕ: запрос на подтверждение 2FA-кода
public record TwoFactorVerifyDto(string TemporaryToken, string Code);

public record TwoFactorToggleDto(bool Enabled);

public record ForgotPasswordDto(string Email);
public record ResetPasswordDto(string Email, string Token, string NewPassword);
