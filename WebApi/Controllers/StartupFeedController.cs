using System.Threading.Tasks;
using Application.Services;
using Core.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StartupFeedController : ControllerBase
{
    private readonly StartupFeedService _startupService;

    public StartupFeedController(StartupFeedService startupService)
    {
        _startupService = startupService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync(
        [FromQuery] string? search,
        [FromQuery] string? stage,
        [FromQuery] string? industry,
        [FromQuery] string? location
        )  
    {
        var startups = await _startupService.GetAllAsync(search, stage, industry, location);
        return Ok(startups);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(string id)
    {
        var startup = await _startupService.GetByIdAsync(id);
        return startup != null ? Ok(startup) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateStartupFeedDto dto)
    {
        var created = await _startupService.CreateAsync(dto);

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateStartupFeedDto dto)
    {
        var updated = await _startupService.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id)
    {
        var deleted = await _startupService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}


