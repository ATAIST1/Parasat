using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class NewsService
    {
        private readonly INewsRepository _newsRepository;
        private readonly IFileStorageService _fileStorage;

        public NewsService(INewsRepository newsRepository, IFileStorageService fileStorage)
        {
            _newsRepository = newsRepository;
            _fileStorage = fileStorage;
        }

        public async Task<List<NewsDto>> GetAllNewsAsync()
        {
            var news = await _newsRepository.GetAllAsync();
            return news.Select(NewsMapper.ToDto).ToList();
        }

        public async Task<NewsDto?> GetNewsByIdAsync(string id)
        {
            var news = await _newsRepository.GetByIdAsync(id);
            return news != null ? NewsMapper.ToDto(news) : null;
        }

        public async Task<List<NewsDto>> GetNewsByCategoryAsync(string category)
        {
            var news = await _newsRepository.GetByCategoryAsync(category);
            return news.Select(NewsMapper.ToDto).ToList();
        }

        public async Task<List<NewsDto>> GetFeaturedNewsAsync(int limit = 5)
        {
            var news = await _newsRepository.GetFeaturedAsync(limit);
            return news.Select(NewsMapper.ToDto).ToList();
        }

        public async Task<List<NewsDto>> GetRecentNewsAsync(int limit = 10)
        {
            var news = await _newsRepository.GetRecentAsync(limit);
            return news.Select(NewsMapper.ToDto).ToList();
        }

        public async Task<NewsDto> CreateNewsAsync(CreateNewsDto dto, IFormFile? image)
        {
            var news = NewsMapper.ToModel(dto);

            if (image != null && image.Length > 0)
            {
                using var stream = image.OpenReadStream();
                var key = $"news/{Guid.NewGuid()}_{image.FileName}";
                var uploadedKey = await _fileStorage.UploadAsync(
                    stream,
                    image.ContentType,
                    key);
                news.ImageKey = uploadedKey;
            }

            var createdNews = await _newsRepository.AddAsync(news);
            return NewsMapper.ToDto(createdNews);
        }

        public async Task<NewsDto?> UpdateNewsAsync(string id, UpdateNewsDto dto, IFormFile? image)
        {
            var existingNews = await _newsRepository.GetByIdAsync(id);
            if (existingNews == null)
                return null;
            var updatedNews = NewsMapper.UpdateModel(existingNews, dto);
            if (image != null && image.Length > 0)
            {
                using var stream = image.OpenReadStream();
                var key = $"news/{existingNews.Id}_{image.FileName}";
                var uploadedKey = await _fileStorage.UploadAsync(
                    stream,
                    image.ContentType,
                    key);
                updatedNews.ImageKey = uploadedKey;
            }
            await _newsRepository.UpdateAsync(updatedNews);
            return NewsMapper.ToDto(updatedNews);
        }

        public async Task<bool> DeleteNewsAsync(string id)
        {
            var existingNews = await _newsRepository.GetByIdAsync(id);
            if (existingNews == null)
                return false;

            await _newsRepository.DeleteAsync(id);
            return true;
        }

        public async Task<List<NewsDto>> SearchNewsAsync(string searchTerm)
        {
            var news = await _newsRepository.SearchAsync(searchTerm);
            return news.Select(NewsMapper.ToDto).ToList();
        }

        public async Task<List<NewsDto>> GetNewsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var news = await _newsRepository.GetByDateRangeAsync(startDate, endDate);
            return news.Select(NewsMapper.ToDto).ToList();
        }
    }
}