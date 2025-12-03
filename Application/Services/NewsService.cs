using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class NewsService
    {
        private readonly INewsRepository _newsRepository;

        public NewsService(INewsRepository newsRepository)
        {
            _newsRepository = newsRepository;
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

        public async Task<NewsDto> CreateNewsAsync(CreateNewsDto dto)
        {
            var news = NewsMapper.ToModel(dto);
            var createdNews = await _newsRepository.AddAsync(news);
            return NewsMapper.ToDto(createdNews);
        }

        public async Task<NewsDto?> UpdateNewsAsync(string id, UpdateNewsDto dto)
        {
            var existingNews = await _newsRepository.GetByIdAsync(id);
            if (existingNews == null)
                return null;

            var updatedNews = NewsMapper.UpdateModel(existingNews, dto);
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