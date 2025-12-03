using Core.Dtos;
using Core.Models;

namespace Application.Mappers
{
    public static class NewsMapper
    {
        public static NewsDto ToDto(News news)
        {
            return new NewsDto
            {
                Id = news.Id,
                Title = news.Title,
                Content = news.Content,
                Description = news.Description,
                Date = news.Date,
                Category = news.Category,
                ImageUrl = news.ImageUrl,
                Badge = news.Badge,
                IsFeatured = news.IsFeatured
            };
        }

        public static News ToModel(CreateNewsDto dto)
        {
            return new News
            {
                Title = dto.Title,
                Content = dto.Content,
                Description = dto.Description,
                Category = dto.Category,
                ImageUrl = dto.ImageUrl,
                Badge = dto.Badge,
                IsFeatured = dto.IsFeatured,
                Date = dto.Date ?? DateTime.UtcNow
            };
        }

        public static News UpdateModel(News existingNews, UpdateNewsDto dto)
        {
            if (dto.Title != null)
                existingNews.Title = dto.Title;
            
            if (dto.Content != null)
                existingNews.Content = dto.Content;
            
            if (dto.Description != null)
                existingNews.Description = dto.Description;
            
            if (dto.Category != null)
                existingNews.Category = dto.Category;
            
            if (dto.ImageUrl != null)
                existingNews.ImageUrl = dto.ImageUrl;
            
            if (dto.Badge != null)
                existingNews.Badge = dto.Badge;
            
            if (dto.IsFeatured.HasValue)
                existingNews.IsFeatured = dto.IsFeatured.Value;
            
            if (dto.Date.HasValue)
                existingNews.Date = dto.Date.Value;
            
            return existingNews;
        }
    }
}