using System.Threading.Tasks;
using Application.Services;
using Core.Dtos;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookmarkController : ControllerBase
{
    private readonly BookmarkService _bookmarkService;
    private readonly IHttpContextAccessor _httpContext;

    public BookmarkController(BookmarkService bookmarkService, IHttpContextAccessor httpContext)
    {
        _bookmarkService = bookmarkService;
        _httpContext = httpContext;
    }

    private string CurrentUserId => _httpContext.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                          ?? throw new UnauthorizedAccessException("User is not authenticated");

    [HttpGet("user")]
    public async Task<IActionResult> GetByUserAsync()
    {
        var bookmarks = await _bookmarkService.GetByUserAsync(CurrentUserId);
        return Ok(bookmarks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateBookmarkDto dto)
    {
        var bookmark = await _bookmarkService.CreateAsync(dto, CurrentUserId);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id)
    {
        var deleted = await _bookmarkService.DeleteAsync(id, CurrentUserId);
        return deleted ? NoContent() : NotFound();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteByUserAndItemAsync([FromQuery] string itemId, [FromQuery] int itemType)
    {
        if (!Enum.IsDefined(typeof(BookmarkItemType), itemType))
        {
            return BadRequest("Invalid itemType. Must be 0 (Startup), 1 (Investor), 2 (Developer), or 3 (Business)");
        }
        
        var deleted = await _bookmarkService.DeleteByUserAndItemAsync(CurrentUserId, itemId, (BookmarkItemType)itemType);
        return deleted ? NoContent() : NotFound();
    }
}

