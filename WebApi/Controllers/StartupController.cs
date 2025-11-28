using System.Threading.Tasks;
using Application.Services;
using Core.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StartupController : ControllerBase
{
    private readonly StartupService _startupService;

    public StartupController(StartupService startupService)
    {
        _startupService = startupService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var startups = await _startupService.GetAllAsync();
        return Ok(startups);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(string id)
    {
        var startup = await _startupService.GetByIdAsync(id);
        return startup != null ? Ok(startup) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateStartupDto dto)
    {
        var created = await _startupService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateStartupDto dto)
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

