using Application.Services;
using Core.Dtos.Startups;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // ✅ защищаем всё, кроме того что явно AllowAnonymous
public class StartupController : ControllerBase
{
    private readonly StartupService _service;

    public StartupController(StartupService service) => _service = service;

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("User is not authenticated");

    // Ленту можно оставить публичной, если хочешь
    [AllowAnonymous]
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

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<StartupResponseDto>> GetById(string id)
    {
        var startup = await _service.GetByIdAsync(id);
        return startup == null ? NotFound() : Ok(startup);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromForm] CreateStartupDto dto,
        IFormFile? pitchDeck,
        IFormFile? financialModel)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // ✅ owner всегда из токена
        var ownerId = CurrentUserId;

        Stream? pitchDeckStream = pitchDeck is { Length: > 0 } ? pitchDeck.OpenReadStream() : null;
        string? pitchDeckContentType = pitchDeckStream != null ? pitchDeck!.ContentType : null;

        Stream? financialModelStream = financialModel is { Length: > 0 } ? financialModel.OpenReadStream() : null;
        string? financialModelContentType = financialModelStream != null ? financialModel!.ContentType : null;

        await _service.CreateAsync(
            ownerId, // ✅ передаём отдельно
            dto,
            pitchDeckStream, pitchDeckContentType,
            financialModelStream, financialModelContentType);

        return Ok(new { message = "Startup created" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromForm] UpdateStartupDto dto,
        IFormFile? pitchDeck,
        IFormFile? financialModel)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        Stream? pitchDeckStream = pitchDeck is { Length: > 0 } ? pitchDeck.OpenReadStream() : null;
        string? pitchDeckContentType = pitchDeckStream != null ? pitchDeck!.ContentType : null;

        Stream? financialModelStream = financialModel is { Length: > 0 } ? financialModel.OpenReadStream() : null;
        string? financialModelContentType = financialModelStream != null ? financialModel!.ContentType : null;

        var success = await _service.UpdateAsync(
            CurrentUserId, // ✅ кто обновляет
            id,
            dto,
            pitchDeckStream, pitchDeckContentType,
            financialModelStream, financialModelContentType);

        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var success = await _service.DeleteAsync(CurrentUserId, id); // ✅ кто удаляет
        return success ? NoContent() : NotFound();
    }

    // ✅ лучше закрыть вообще, либо только админам
    [Authorize(Roles = "Admin")]
    [HttpGet("s3-test")]
    public async Task<IActionResult> TestS3([FromServices] IFileStorageService storage)
    {
        using var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello s3"));
        var key = $"test/{Guid.NewGuid()}";

        await storage.UploadAsync(stream, "text/plain", key);
        var url = await storage.GetDownloadUrlAsync(key, TimeSpan.FromMinutes(5));

        return Ok(new { key, url });
    }

    [AllowAnonymous]
    [HttpGet("{id}/pitchdeck")]
    public async Task<IActionResult> GetPitchDeck(string id)
    {
        var url = await _service.GetPitchDeckUrlAsync(id);
        return url == null ? NotFound() : Ok(new { url });
    }

    [AllowAnonymous]
    [HttpGet("{id}/financialmodel")]
    public async Task<IActionResult> GetFinancialModel(string id)
    {
        var url = await _service.GetFinancialModelUrlAsync(id);
        return url == null ? NotFound() : Ok(new { url });
    }
}
