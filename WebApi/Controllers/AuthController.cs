using Core.Dtos;
using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application.Mappers;
namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
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
}