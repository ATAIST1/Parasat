using Application.Services;
using Core.Dtos.Startups;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

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
            [FromQuery] string? evidence,
            [FromQuery] string? city)
        {
            var startups = await _service.GetAllAsync(search, industry, evidence, city);
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
        // Accepts form-data: all CreateStartupDto fields + optional file "pitchDeck"
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm] CreateStartupDto dto,
            IFormFile? pitchDeck)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Stream? pitchDeckStream = null;
            string? pitchDeckContentType = null;

            if (pitchDeck is { Length: > 0 })
            {
                pitchDeckStream = pitchDeck.OpenReadStream();
                pitchDeckContentType = pitchDeck.ContentType;
            }

            await _service.CreateAsync(dto, pitchDeckStream, pitchDeckContentType);

            return Ok(new { message = "Startup created" });
        }

        // PUT api/startup/{id}
        // Accepts form-data: all UpdateStartupDto fields + optional file "pitchDeck"
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            string id,
            [FromForm] UpdateStartupDto dto,
            IFormFile? pitchDeck)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Stream? pitchDeckStream = null;
            string? pitchDeckContentType = null;

            if (pitchDeck is { Length: > 0 })
            {
                pitchDeckStream = pitchDeck.OpenReadStream();
                pitchDeckContentType = pitchDeck.ContentType;
            }

            var success = await _service.UpdateAsync(id, dto, pitchDeckStream, pitchDeckContentType);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // DELETE api/startup/{id}
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
