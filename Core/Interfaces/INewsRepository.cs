using Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface INewsRepository
    {
        Task<News?> GetByIdAsync(string id);
        Task<List<News>> GetAllAsync();
        Task<List<News>> GetByCategoryAsync(string category);
        Task<List<News>> GetFeaturedAsync(int limit = 5);
        Task<List<News>> GetRecentAsync(int limit = 10);
        Task<News> AddAsync(News news);
        Task UpdateAsync(News news);
        Task DeleteAsync(string id);
        Task<List<News>> SearchAsync(string searchTerm);
        Task<List<News>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
}