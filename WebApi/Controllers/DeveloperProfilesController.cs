using Application.Services;
using Core.Dtos.Developer;
using Core.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeveloperProfilesController : ControllerBase
    {
        private readonly DeveloperProfileService _service;

        public DeveloperProfilesController(DeveloperProfileService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<DeveloperProfileResponseDto>>> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<DeveloperProfileResponseDto>> GetById(string id)
            => await _service.GetByIdAsync(id) is {} p ? Ok(p) : NotFound();

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<DeveloperProfileResponseDto>> GetByUserId(string userId)
            => await _service.GetByUserIdAsync(userId) is {} p ? Ok(p) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDeveloperProfileDto dto)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);
            await _service.CreateAsync(dto);
            return Ok(new { message = "Профиль разработчика создан" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateDeveloperProfileDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var success = await _service.UpdateAsync(id, dto);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
            => await _service.DeleteAsync(id) ? NoContent() : NotFound();

        [HttpGet("search")]
        public async Task<ActionResult<List<DeveloperProfileResponseDto>>> Search(
            [FromQuery] List<string>? types = null,
            [FromQuery] string? city = null,
            [FromQuery] bool? isRemote = null,
            [FromQuery] List<string>? techStack = null,
            [FromQuery] string? experience = null,
            [FromQuery] bool? isAvailable = null)
        {
            var result = await _service.SearchAsync(types, city, isRemote, techStack, experience, isAvailable);
            return Ok(result);
        }
    }
}