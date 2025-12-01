using System.Threading.Tasks;
using Application.Services;
using Core.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessController : ControllerBase
{
    private readonly BusinessService _businessService;

    public BusinessController(BusinessService businessService)
    {
        _businessService = businessService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var businesses = await _businessService.GetAllAsync();
        return Ok(businesses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(string id)
    {
        var business = await _businessService.GetByIdAsync(id);
        return business != null ? Ok(business) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateBusinessDto dto)
    {
        var created = await _businessService.CreateAsync(dto);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateBusinessDto dto)
    {
        var updated = await _businessService.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id)
    {
        var deleted = await _businessService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}

