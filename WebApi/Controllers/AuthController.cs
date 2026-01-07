using Core.Dtos;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application.Mappers;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IUserRepository _userRepo;

    public AuthController(AuthService authService, IUserRepository userRepo)
    {
        _authService = authService;
        _userRepo = userRepo;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        try
        {
            var user = await _authService.RegisterAsync(dto);
            return Ok(UserMapper.ToDto(user!));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


// ЛИАНА ДОБАВИЛА ЕС ЧО УБЕРЕМ Улучшенный метод логина с разными ответами для неподтвержденного email и неверных данных 
[HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginDto dto)
    {
        try
        {
            var response = await _authService.LoginAsync(dto);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            // ЯВНО смотрим, что за юзер
            var user = await _userRepo.GetByEmailAsync(dto.Email);

            // 1) Юзера с таким email нет
            if (user == null)
            {
                return Unauthorized(new
                {
                    code = "EMAIL_NOT_FOUND",
                    message = "Пользователь с таким email не найден"
                });
            }

            // 2) Пользователь заблокирован
            if (user.IsBanned || (user.BannedUntil.HasValue && user.BannedUntil > DateTime.UtcNow))
            {
                return Unauthorized(new
                {
                    code = "USER_BANNED",
                    message = user.BannedUntil.HasValue
                        ? $"Пользователь заблокирован до {user.BannedUntil:yyyy-MM-dd HH:mm:ss} UTC"
                        : "Пользователь заблокирован"
                });
            }

            // 3) Есть, но пароль неверный или иная ошибка авторизации
            return Unauthorized(new
            {
                code = "INVALID_CREDENTIALS",
                message = "Неверный пароль"
            });
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponse>> Refresh(RefreshTokenRequest request)
    {
        try
        {
            var tokens = await _authService.RefreshTokenAsync(request);
            return Ok(tokens);
        }
        catch (Exception)
        {
            return Unauthorized("Invalid refresh token");
        }
    }
    [HttpPost("google")]
    public async Task<ActionResult<TokenResponse>> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        try
        {
            var tokens = await _authService.LoginWithGoogleAsync(dto);
            return Ok(tokens);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string token, string email)
    {
        var user = await _userRepo.GetByEmailAsync(email);
        if (user == null || user.EmailConfirmationToken != token || 
            user.EmailConfirmationTokenExpires < DateTime.UtcNow)
        {
            return BadRequest("Invalid or expired confirmation link.");
        }

        user.EmailConfirmed = true;
        user.EmailConfirmationToken = null;
        user.EmailConfirmationTokenExpires = null;
        await _userRepo.UpdateAsync(user);

        return Ok("Email confirmed! You can now log in.");
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] LogoutDto? dto = null)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Invalid token");
            }

            await _authService.LogoutAsync(userId, dto?.RefreshToken);
            return Ok(new { message = "Logged out successfully" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("resend-confirmation")]
    public async Task<IActionResult> ResendConfirmation([FromBody] ResendConfirmationDto dto)
    {
        try
        {
            await _authService.ResendConfirmationEmailAsync(dto);
            return Ok(new { message = "Confirmation email has been sent. Please check your inbox." });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid token");
            await _authService.ChangePasswordAsync(userId, dto);
            return Ok(new { message = "Password changed successfully" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("2fa/verify")]
    [AllowAnonymous]
    public async Task<ActionResult<TokenResponse>> VerifyTwoFactor([FromBody] TwoFactorVerifyDto dto)
    {
        try
        {
            var tokens = await _authService.VerifyTwoFactorAsync(dto);
            return Ok(tokens);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Authorize] // чтобы нельзя было менять 2FA без логина
    [HttpPost("2fa/toggle")]
    public async Task<IActionResult> ToggleTwoFactor([FromBody] TwoFactorToggleDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        await _authService.ToggleTwoFactorAsync(userId, dto.Enabled);

        return Ok(new { message = $"Two-factor authentication {(dto.Enabled ? "enabled" : "disabled")}." });
    }
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        // Всегда возвращаем 200, даже если email не найден – не палим наличие аккаунта
        await _authService.RequestPasswordResetAsync(dto);
        return Ok(new { message = "Если такой email существует, на него отправлено письмо для восстановления пароля." });
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        try
        {
            await _authService.ResetPasswordAsync(dto);
            return Ok(new { message = "Пароль успешно изменён" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}