using Application.Services;
using Core.Dtos.Investor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous] // временно публичный
    public class InvestorProfilesController : ControllerBase
    {
        private readonly InvestorProfileService _service;
        private readonly InvestorContactsService _contactsService;

        public InvestorProfilesController(InvestorProfileService service, InvestorContactsService contactsService)
        {
            _service = service;
            _contactsService = contactsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var investor = await _service.GetByIdAsync(id);
            if (investor == null) return NotFound();
            return Ok(investor);
        }

        [HttpGet("{id}/contacts")]
        [Authorize]
        public async Task<IActionResult> GetContacts(string id)
        {
            var requesterUserId =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrWhiteSpace(requesterUserId))
                return Unauthorized();

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
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateInvestorProfileDto dto)
        {
            var userId = GetUserId();
            await _service.CreateAsync(dto, userId);
            return Ok(new { message = "Профиль инвестора создан" });
        }


        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateInvestorProfileDto dto)
        {
            var userId = GetUserId();
            var updated = await _service.UpdateAsync(id, dto, userId);
            if (!updated) return NotFound();
            return Ok(new { message = "Профиль инвестора обновлён" });
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = GetUserId();
            var deleted = await _service.DeleteAsync(id, userId);
            if (!deleted) return NotFound();
            return Ok(new { message = "Профиль инвестора удалён" });
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value
                ?? throw new UnauthorizedAccessException("User id not found in token");
        }

    }
}
