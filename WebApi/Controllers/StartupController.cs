using Application.Services;
using Core.Dtos.Startups;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StartupController : ControllerBase
    {
        private readonly StartupService _service;

        public StartupController(StartupService service)
        {
            _service = service;
        }

        // GET api/startup
        [HttpGet]
        public async Task<ActionResult<List<StartupResponseDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? industry,
        [FromQuery] string? city)
        {
            var startups = await _service.GetAllAsync(search, industry, city);
            return Ok(startups);
        }

        // GET api/startup/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StartupResponseDto>> GetById(string id)
        {
            var startup = await _service.GetByIdAsync(id);
            if (startup == null)
                return NotFound();

            return Ok(startup);
        }

        // POST api/startup
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStartupDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.CreateAsync(model);
            return Ok(new { message = "Startup successfully created" });
        }

        // PUT api/startup
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateStartupDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _service.UpdateAsync(id, dto);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // DELETE api/startup
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}