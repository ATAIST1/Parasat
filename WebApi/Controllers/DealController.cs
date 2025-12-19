using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/deals")]
public class DealController : ControllerBase
{
    private readonly IDealRepository _dealRepo;
    private readonly IConversationRepository _conversationRepo;

    public DealController(
        IDealRepository dealRepo,
        IConversationRepository conversationRepo)
    {
        _dealRepo = dealRepo;
        _conversationRepo = conversationRepo;
    }

    private string UserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpPost("{conversationId}/action")]
    public async Task<IActionResult> Action(
        string conversationId,
        [FromBody] DealActionDto dto)
    {
        var deal = await _dealRepo.GetByConversationIdAsync(conversationId);
        if (deal == null)
            return NotFound("Deal not found");
        if (deal.Status != DealStatus.Pending)
            return BadRequest("Deal is already finalized");

       var conversation = await _conversationRepo.GetByIdAsync(conversationId);
       if (conversation == null)
           return NotFound("Conversation not found");

       // БЛОК: запрет повторного accept тем же юзером
       if (UserId == conversation.OwnerId && deal.OwnerAccepted)
           return BadRequest("Owner already accepted");

       if (UserId == conversation.InitiatorId && deal.InitiatorAccepted)
           return BadRequest("Initiator already accepted");

        // кто нажал
        if (UserId == conversation.OwnerId)
            deal.OwnerAccepted = dto.Accept;
        else if (UserId == conversation.InitiatorId)
            deal.InitiatorAccepted = dto.Accept;
        else
            return Forbid();

        // логика статуса
        if (!dto.Accept)
        {
            deal.Status = DealStatus.Rejected;
            deal.ClosedAtUtc = DateTime.UtcNow;
        }
        else if (deal.OwnerAccepted && deal.InitiatorAccepted)
        {
            deal.Status = DealStatus.Active;
            deal.ActivatedAtUtc = DateTime.UtcNow;
        }

        await _dealRepo.UpdateAsync(deal);
        return Ok(deal);
    }
}
