using Application.Services;
using Core.Dtos.Investor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // Можешь вообще сделать весь контроллер публичным во время разработки:
    [AllowAnonymous]
    public class InvestorProfilesController : ControllerBase
    {
        private readonly InvestorProfileService _service;

        public InvestorProfilesController(InvestorProfileService service)
        {
            _service = service;
        }

        // GET: /api/InvestorProfiles
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }

        // GET: /api/InvestorProfiles/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: /api/InvestorProfiles
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInvestorProfileDto dto)
        {
            // ВРЕМЕННО: без реального userId
            var userId = "dev-user";

            await _service.CreateAsync(dto, userId);
            return Ok(new { message = "Профиль инвестора создан" });
        }

        // PUT: /api/InvestorProfiles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateInvestorProfileDto dto)
        {
          // тоже без userId-проверок на время разработки
          var updated = await _service.UpdateAsync(id, dto, userId: "dev-user");
          if (!updated) return NotFound();
          return Ok(new { message = "Профиль инвестора обновлён" });
        }

        // DELETE: /api/InvestorProfiles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _service.DeleteAsync(id, userId: "dev-user");
            if (!deleted) return NotFound();
            return Ok(new { message = "Профиль инвестора удалён" });
        }
    }
}
