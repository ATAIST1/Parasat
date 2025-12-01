using System.Threading.Tasks;
using Application.Services;
using Core.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookmarkController : ControllerBase
{
    private readonly BookmarkService _bookmarkService;

    public BookmarkController(BookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserAsync(string userId)
    {
        var bookmarks = await _bookmarkService.GetByUserAsync(userId);
        return Ok(bookmarks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateBookmarkDto dto)
    {
        var bookmark = await _bookmarkService.CreateAsync(dto);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id)
    {
        var deleted = await _bookmarkService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteByUserAndItemAsync([FromQuery] string userId, [FromQuery] string itemId, [FromQuery] string itemType)
    {
        var deleted = await _bookmarkService.DeleteByUserAndItemAsync(userId, itemId, itemType);
        return deleted ? NoContent() : NotFound();
    }
}

