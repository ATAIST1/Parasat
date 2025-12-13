using Application.Services;
using Core.Dtos.Investment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvestmentRequestsController : ControllerBase
{
    private readonly InvestmentRequestService _service;

    public InvestmentRequestsController(InvestmentRequestService service)
    {
        _service = service;
    }

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("User is not authenticated");

    // Публичная лента — только Published
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<InvestmentRequestResponseDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? industry,
        [FromQuery] string? profitRange,
        [FromQuery] string? equityRange)
    {
        var requests = await _service.GetAllPublishedAsync(search, industry, profitRange, equityRange);
        return Ok(requests);
    }

    // Мои заявки (и Draft и Published)
    [Authorize]
    [HttpGet("my")]
    public async Task<ActionResult<List<InvestmentRequestResponseDto>>> GetMy()
    {
        var requests = await _service.GetMyAsync(CurrentUserId);
        return Ok(requests);
    }

    // Деталка: published видят все, draft — только владелец
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<InvestmentRequestResponseDto>> GetById(string id)
    {
        var userIdOrNull = User.Identity?.IsAuthenticated == true
            ? User.FindFirstValue(ClaimTypes.NameIdentifier)
            : null;

        var dto = await _service.GetByIdAsync(id, userIdOrNull);
        return dto == null ? NotFound() : Ok(dto);
    }

    // Создание — только авторизованный
    [Authorize]
    [HttpPost]
    [RequestSizeLimit(100_000_000)]
    public async Task<IActionResult> Create(
        [FromForm] CreateInvestmentRequestDto dto,
        IFormFile? investmentMemorandum,
        IFormFile? financialReport,
        IFormFile? businessPlan,
        IFormFile? presentation,
        List<IFormFile>? otherDocuments)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        Stream? memoStream = investmentMemorandum is { Length: > 0 } ? investmentMemorandum.OpenReadStream() : null;
        string? memoContentType = memoStream != null ? investmentMemorandum!.ContentType : null;

        Stream? finStream = financialReport is { Length: > 0 } ? financialReport.OpenReadStream() : null;
        string? finContentType = finStream != null ? financialReport!.ContentType : null;

        Stream? bpStream = businessPlan is { Length: > 0 } ? businessPlan.OpenReadStream() : null;
        string? bpContentType = bpStream != null ? businessPlan!.ContentType : null;

        Stream? presStream = presentation is { Length: > 0 } ? presentation.OpenReadStream() : null;
        string? presContentType = presStream != null ? presentation!.ContentType : null;

        var otherDocs = new List<(Stream Stream, string ContentType, string FileName)>();
        if (otherDocuments != null)
        {
            foreach (var f in otherDocuments.Where(x => x is { Length: > 0 }))
                otherDocs.Add((f.OpenReadStream(), f.ContentType, f.FileName));
        }

        await _service.CreateAsync(
            dto,
            CurrentUserId,
            memoStream, memoContentType,
            finStream, finContentType,
            bpStream, bpContentType,
            presStream, presContentType,
            otherDocs);

        return Ok(new { message = "Investment request created (draft)" });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateInvestmentRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var success = await _service.UpdateAsync(id, dto, CurrentUserId);
        return success ? NoContent() : NotFound();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var success = await _service.DeleteAsync(id, CurrentUserId);
        return success ? NoContent() : NotFound();
    }

    [Authorize]
    [HttpPost("{id}/publish")]
    public async Task<IActionResult> Publish(string id)
    {
        var success = await _service.PublishAsync(id, CurrentUserId);
        return success
            ? Ok(new { message = "Published" })
            : BadRequest("Cannot publish (not owner or not draft)");
    }
}
