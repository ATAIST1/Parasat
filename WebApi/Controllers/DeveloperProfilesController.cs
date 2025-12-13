using Application.Services;
using Core.Dtos.Developer;
using Core.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class DeveloperProfilesController : ControllerBase
{
    private readonly DeveloperProfileService _service;

    public DeveloperProfilesController(DeveloperProfileService service) => _service = service;

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("User is not authenticated");

    // публично (лента/поиск)
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<DeveloperProfileResponseDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<DeveloperProfileResponseDto>> GetById(string id)
        => await _service.GetByIdAsync(id) is {} p ? Ok(p) : NotFound();

    [AllowAnonymous]
    [HttpGet("search")]
    public async Task<ActionResult<List<DeveloperProfileResponseDto>>> Search(
        [FromQuery] List<string>? types = null,
        [FromQuery] string? city = null,
        [FromQuery] bool? isRemote = null,
        [FromQuery] List<string>? techStack = null,
        [FromQuery] string? experience = null,
        [FromQuery] bool? isAvailable = null)
        => Ok(await _service.SearchAsync(types, city, isRemote, techStack, experience, isAvailable));

    // приватно (CRUD)
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<DeveloperProfileResponseDto>> GetMy()
        => await _service.GetByUserIdAsync(CurrentUserId) is {} p ? Ok(p) : NotFound();

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDeveloperProfileDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User is not authenticated");

        await _service.CreateAsync(userId, dto);
        return Ok(new { message = "Профиль разработчика создан" });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateDeveloperProfileDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var success = await _service.UpdateAsync(CurrentUserId, id, dto); // ✅ проверка владельца
        return success ? NoContent() : NotFound();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
        => await _service.DeleteAsync(CurrentUserId, id) ? NoContent() : NotFound();
}
