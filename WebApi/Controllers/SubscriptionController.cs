using Application.Services;
using Core.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers;

[ApiController]
[Route("api/subscription")]
[Authorize] // подписка только для залогиненных
public class SubscriptionController : ControllerBase
{
    private readonly SubscriptionService _subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    private string GetCurrentUserId()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier)
                 ?? User.FindFirstValue(ClaimTypes.Name)
                 ?? throw new Exception("User id not found in token");

        return id;
    }

    [HttpGet("investor-contacts/status")]
    public async Task<ActionResult<SubscriptionStatusDto>> GetStatus()
    {
        var userId = GetCurrentUserId();
        var status = await _subscriptionService.GetInvestorContactsSubscriptionStatusAsync(userId);
        return Ok(status);
    }

    [HttpPost("investor-contacts")]
    public async Task<ActionResult<SubscriptionStatusDto>> CreateOrExtend([FromBody] CreateOrExtendSubscriptionDto dto)
    {
        var userId = GetCurrentUserId();
        var status = await _subscriptionService.CreateOrExtendInvestorContactsSubscriptionAsync(userId, dto);
        return Ok(status);
    }
}
