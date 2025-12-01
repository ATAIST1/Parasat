using System.Threading.Tasks;
using Application.Services;
using Core.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeveloperController : ControllerBase
{
    private readonly DeveloperService _developerService;

    public DeveloperController(DeveloperService developerService)
    {
        _developerService = developerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var developers = await _developerService.GetAllAsync();
        return Ok(developers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(string id)
    {
        var developer = await _developerService.GetByIdAsync(id);
        return developer != null ? Ok(developer) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateDeveloperDto dto)
    {
        var created = await _developerService.CreateAsync(dto);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateDeveloperDto dto)
    {
        var updated = await _developerService.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id)
    {
        var deleted = await _developerService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}

