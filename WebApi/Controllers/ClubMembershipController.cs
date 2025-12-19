using Application.Services;
using Core.Dtos.ClubMembership;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/club-membership")]
    public class ClubMembershipController : ControllerBase
    {
        private readonly ClubMembershipService _service;

        public ClubMembershipController(ClubMembershipService service)
        {
            _service = service;
        }

        private string UserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User is not authenticated");

        [HttpGet("me")]
        public async Task<ActionResult<ClubMembershipApplicationResponseDto>> GetMy()
        {
            var item = await _service.GetMyAsync(UserId);
            if (item == null) return NotFound(new { message = "Заявка не найдена" });
            return Ok(item);
        }

        [HttpPost("applications")]
        public async Task<IActionResult> Create([FromBody] CreateClubMembershipApplicationDto dto)
        {
            await _service.CreateAsync(dto, UserId);
            return Ok(new { message = "Заявка создана" });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("applications")]
        public async Task<ActionResult<List<ClubMembershipApplicationResponseDto>>> GetAll()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("applications/{id}/approve")]
        public async Task<IActionResult> Approve(string id, [FromBody] DecideClubMembershipApplicationDto dto)
        {
            var ok = await _service.ApproveAsync(id, UserId, dto.Comment);
            if (!ok) return NotFound(new { message = "Заявка не найдена" });
            return Ok(new { message = "Заявка одобрена" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("applications/{id}/reject")]
        public async Task<IActionResult> Reject(string id, [FromBody] DecideClubMembershipApplicationDto dto)
        {
            var ok = await _service.RejectAsync(id, UserId, dto.Comment);
            if (!ok) return NotFound(new { message = "Заявка не найдена" });
            return Ok(new { message = "Заявка отклонена" });
        }
    }
}
