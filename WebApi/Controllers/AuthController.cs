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

    [HttpPost("login")]
    public async Task<ActionResult<TokenResponse>> Login(LoginDto dto)
    {
        try
        {
            var tokens = await _authService.LoginAsync(dto);
            return Ok(tokens);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("Invalid email or password");
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
}