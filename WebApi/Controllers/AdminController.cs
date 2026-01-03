using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Services;
using Core.Models;
using Core.Dtos.Admin;

namespace WebApi.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;

    public AdminController(AdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost("users/{id}/role")]
    public async Task<IActionResult> ChangeRole(string id, [FromBody] string role)
    {
        await _adminService.ChangeRoleAsync(id, role);
        return Ok(new { message = "Role updated" });
    }

    [HttpPost("users/{id}/2fa")]
    public async Task<IActionResult> Toggle2FA(string id, [FromBody] bool enabled)
    {
        await _adminService.ToggleTwoFactorAsync(id, enabled);
        return Ok(new { message = "2FA updated" });
    }

    [HttpPost("users/{id}/ban")]
    public async Task<IActionResult> BanUser(string id)
    {
        await _adminService.BanUserAsync(id);
        return Ok(new { message = "User banned" });
    }

    [HttpPost("users/{id}/unban")]
    public async Task<IActionResult> UnbanUser(string id)
    {
        await _adminService.UnbanUserAsync(id);
        return Ok(new { message = "User unbanned" });
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> GetAllConversations()
    {
        var list = await _adminService.GetAllConversationsAsync();
        return Ok(list);
    }

    [HttpGet("deals")]
    public async Task<IActionResult> GetAllDeals()
    {
        var list = await _adminService.GetAllDealsAsync();
        return Ok(list);
    }
    [HttpPatch("users/{id}/investor-verification")]
    public async Task<IActionResult> UpdateInvestorVerification(string id, [FromBody] UpdateInvestorVerificationDto dto)
    {
        // кто именно сделал: можно email из claims, но минимум — NameIdentifier
        var adminId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                    ?? User.Identity?.Name
                    ?? "admin";

        await _adminService.UpdateInvestorVerificationAsync(id, dto.Status, dto.Note, adminId);
        return Ok(new { message = "Investor verification updated" });
    }

}
