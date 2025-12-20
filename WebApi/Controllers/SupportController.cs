using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Services;
using Core.Dtos.Support;
using System.Security.Claims;

namespace WebApi.Controllers;

[ApiController]
[Route("api/support")]
[Authorize]
public class SupportController : ControllerBase
{
    private readonly SupportService _supportService;

    public SupportController(SupportService supportService)
    {
        _supportService = supportService;
    }

    /// <summary>Create a new support ticket.</summary>
    [HttpPost("tickets")]
    public async Task<ActionResult<SupportTicketDto>> CreateTicket([FromBody] CreateSupportTicketDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var ticket = await _supportService.CreateTicketAsync(userId, dto);
            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Get all tickets for the current user.</summary>
    [HttpGet("tickets")]
    public async Task<ActionResult<List<SupportTicketDto>>> GetMyTickets()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var tickets = await _supportService.GetUserTicketsAsync(userId);
            return Ok(tickets);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Get a specific ticket by ID.</summary>
    [HttpGet("tickets/{id}")]
    public async Task<ActionResult<SupportTicketDto>> GetTicket(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var ticket = await _supportService.GetTicketAsync(id, userId);
            return Ok(ticket);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>Add a message to a support ticket.</summary>
    [HttpPost("tickets/{id}/messages")]
    public async Task<ActionResult<SupportTicketDto>> AddMessage(string id, [FromBody] SendSupportMessageDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            var ticket = await _supportService.AddMessageAsync(id, userId, dto);
            return Ok(ticket);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Update ticket status (Admin only).</summary>
    [HttpPatch("tickets/{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SupportTicketDto>> UpdateStatus(string id, [FromBody] UpdateTicketStatusDto dto)
    {
        try
        {
            var ticket = await _supportService.UpdateStatusAsync(id, dto.Status);
            return Ok(ticket);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Assign ticket to support agent (Admin only).</summary>
    [HttpPost("tickets/{id}/assign")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SupportTicketDto>> AssignToAgent(string id, [FromBody] string agentId)
    {
        try
        {
            var ticket = await _supportService.AssignToAgentAsync(id, agentId);
            return Ok(ticket);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Get all open tickets (Admin/Support only).</summary>
    [HttpGet("admin/tickets")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<SupportTicketDto>>> GetAllOpenTickets()
    {
        try
        {
            var tickets = await _supportService.GetAllOpenTicketsAsync();
            return Ok(tickets);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
