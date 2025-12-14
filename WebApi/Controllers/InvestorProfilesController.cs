using Application.Services;
using Core.Dtos.Investor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // REMOVED [AllowAnonymous] - теперь требуется авторизация
    public class InvestorProfilesController : ControllerBase
    {
        private readonly InvestorProfileService _service;
        private readonly InvestorContactsService _contactsService;

        public InvestorProfilesController(InvestorProfileService service, InvestorContactsService contactsService)
        {
            _service = service;
            _contactsService = contactsService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var investor = await _service.GetByIdAsync(id);
            if (investor == null) return NotFound();
            return Ok(investor);
        }

        [HttpGet("{id}/contacts")]
        public async Task<IActionResult> GetContacts(string id)
        {
            var requesterUserId = GetUserId();

            try
            {
                var contacts = await _contactsService.GetContactsAsync(id, requesterUserId);
                return Ok(contacts);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInvestorProfileDto dto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var userId = GetUserId();
            try
            {
                await _service.CreateAsync(dto, userId);
                return Ok(new { message = "Профиль инвестора создан" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateInvestorProfileDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var userId = GetUserId();
            var updated = await _service.UpdateAsync(id, dto, userId);
            if (!updated) return NotFound();
            return Ok(new { message = "Профиль инвестора обновлён" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = GetUserId();
            var deleted = await _service.DeleteAsync(id, userId);
            if (!deleted) return NotFound();
            return Ok(new { message = "Профиль инвестора удалён" });
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = GetUserId();
            var profile = await _service.GetByUserIdAsync(userId);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? throw new UnauthorizedAccessException("User id not found in token");
        }
    }
}