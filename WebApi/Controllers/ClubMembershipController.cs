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

        // ✅ для защищённых эндпоинтов (где [Authorize] обязателен)
        private string UserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User is not authenticated");

        // ✅ для публичного эндпоинта — НЕ кидаем exception
        private string? UserIdOrNull =>
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        // 🔒 только для залогиненного: "мой статус/заявка"
        [HttpGet("me")]
        public async Task<ActionResult<ClubMembershipApplicationResponseDto>> GetMy()
        {
            var item = await _service.GetMyAsync(UserId);
            if (item == null) return NotFound(new { message = "Заявка не найдена" });
            return Ok(item);
        }

        // ✅ ЕДИНСТВЕННЫЙ публичный эндпоинт
        // Можно отправить заявку вообще без токена
        [AllowAnonymous]
        [HttpPost("applications")]
        public async Task<IActionResult> Create([FromBody] CreateClubMembershipApplicationDto dto)
        {
            // если пользователь залогинен — userId будет; если нет — null
            var userId = UserIdOrNull;

            // ⚠️ Важно: сервис должен уметь принять nullable userId
            // Если сейчас сигнатура CreateAsync(dto, string userId) — поменяй на string? userId
            var result = await _service.CreateAsync(dto, userId);

            // Рекомендую возвращать статус, чтобы фронт показал "В обработке"
            // result.Status например: Pending / Approved / Rejected
            return Ok(new
            {
                message = "Ваша заявка в обработке, ожидайте",
                status = result.Status,
                applicationId = result.Id
            });
        }

        // 🔒 админка
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
