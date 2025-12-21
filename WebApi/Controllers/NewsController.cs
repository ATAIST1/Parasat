using Application.Services;
using Core.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Core.Interfaces;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly NewsService _newsService;

        public NewsController(NewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNews()
        {
            var news = await _newsService.GetAllNewsAsync();
            return Ok(news);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentNews([FromQuery] int limit = 10)
        {
            var news = await _newsService.GetRecentNewsAsync(limit);
            return Ok(news);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedNews([FromQuery] int limit = 5)
        {
            var news = await _newsService.GetFeaturedNewsAsync(limit);
            return Ok(news);
        }

        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetNewsByCategory(string category)
        {
            var news = await _newsService.GetNewsByCategoryAsync(category);
            return Ok(news);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(string id)
        {
            var news = await _newsService.GetNewsByIdAsync(id);
            return news != null ? Ok(news) : NotFound();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchNews([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return BadRequest("Search term is required");

            var news = await _newsService.SearchNewsAsync(term);
            return Ok(news);
        }

        [HttpGet("{id}/image")]
        public async Task<IActionResult> GetNewsImage(string id, [FromServices] IFileStorageService storage)
        {
            var news = await _newsService.GetNewsByIdAsync(id);
            if (news == null || string.IsNullOrEmpty(news.ImageKey))
                return NotFound();
            var url = await storage.GetDownloadUrlAsync(news.ImageKey, TimeSpan.FromMinutes(10));
            return Ok(new { url });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateNews([
            FromForm] CreateNewsDto dto, IFormFile? image)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdNews = await _newsService.CreateNewsAsync(dto, image);
            return CreatedAtAction(nameof(GetNewsById), new { id = createdNews.Id }, createdNews);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNews(string id, [FromForm] UpdateNewsDto dto, IFormFile? image)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedNews = await _newsService.UpdateNewsAsync(id, dto, image);
            return updatedNews != null ? Ok(updatedNews) : NotFound();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(string id)
        {
            var result = await _newsService.DeleteNewsAsync(id);
            return result ? NoContent() : NotFound();
        }

        [HttpGet("date-range")]
        public async Task<IActionResult> GetNewsByDateRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            if (startDate > endDate)
                return BadRequest("Start date must be before end date");

            var news = await _newsService.GetNewsByDateRangeAsync(startDate, endDate);
            return Ok(news);
        }
    }
}