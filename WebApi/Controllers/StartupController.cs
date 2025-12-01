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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStartupDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.CreateAsync(dto);

            return Ok(new { message = "Startup created" });
        }
    }
}
