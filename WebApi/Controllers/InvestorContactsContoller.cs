using Application.Services;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers;

[ApiController]
[Route("api/investors")]
[Authorize] // важно: только залогиненные
public class InvestorContactsController : ControllerBase
{
    private readonly SubscriptionService _subs;
    private readonly IUserRepository _userRepo;

    public InvestorContactsController(SubscriptionService subs, IUserRepository userRepo)
    {
        _subs = subs;
        _userRepo = userRepo;
    }

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("User is not authenticated");

    [HttpGet("{investorId}/contacts")]
    public async Task<IActionResult> GetInvestorContacts(string investorId)
    {
        // ✅ доступ только если подписка активна
        var hasSub = await _subs.HasActiveInvestorContactsSubscriptionAsync(CurrentUserId);
        if (!hasSub) return Forbid();

        var investor = await _userRepo.GetByIdAsync(investorId);
        if (investor == null) return NotFound();

        // ✅ отдаём ТОЛЬКО нужные поля (не весь UserDto)
        return Ok(new
        {
            investor.Id,
            investor.Name,
            investor.Email,
            investor.Phone,
            investor.Telegram,
        });
    }
}
