using System.Threading.Tasks;
using Application.Services;
using Core.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvestorFeedController : ControllerBase
{
    private readonly InvestorFeedService _investorService;

    public InvestorFeedController(InvestorFeedService investorService)
    {
        _investorService = investorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var investors = await _investorService.GetAllAsync();
        return Ok(investors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(string id)
    {
        var investor = await _investorService.GetByIdAsync(id);
        return investor != null ? Ok(investor) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateInvestorFeedDto dto)
    {
        var created = await _investorService.CreateAsync(dto);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateInvestorFeedDto dto)
    {
        var updated = await _investorService.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id)
    {
        var deleted = await _investorService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}


