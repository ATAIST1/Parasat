using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class NewsRepository : INewsRepository
    {
        private readonly IMongoCollection<News> _news;

        public NewsRepository(IMongoDatabase database)
        {
            _news = database.GetCollection<News>("news");
        }

        public async Task<News?> GetByIdAsync(string id)
        {
            return await _news.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<News>> GetAllAsync()
        {
            return await _news.Find(_ => true)
                             .SortByDescending(x => x.Date)
                             .ToListAsync();
        }

        public async Task<List<News>> GetByCategoryAsync(string category)
        {
            return await _news.Find(x => x.Category == category)
                             .SortByDescending(x => x.Date)
                             .ToListAsync();
        }

        public async Task<List<News>> GetFeaturedAsync(int limit = 5)
        {
            return await _news.Find(x => x.IsFeatured)
                             .SortByDescending(x => x.Date)
                             .Limit(limit)
                             .ToListAsync();
        }

        public async Task<List<News>> GetRecentAsync(int limit = 10)
        {
            return await _news.Find(_ => true)
                             .SortByDescending(x => x.Date)
                             .Limit(limit)
                             .ToListAsync();
        }

        public async Task<News> AddAsync(News news)
        {
            await _news.InsertOneAsync(news);
            return news;
        }

        public async Task UpdateAsync(News news)
        {
            news.UpdatedAt = DateTime.UtcNow;
            await _news.ReplaceOneAsync(x => x.Id == news.Id, news);
        }

        public async Task DeleteAsync(string id)
        {
            await _news.DeleteOneAsync(x => x.Id == id);
        }

        public async Task<List<News>> SearchAsync(string searchTerm)
{
    if (string.IsNullOrWhiteSpace(searchTerm))
        return await GetAllAsync();

    var filter = Builders<News>.Filter.Or(
        Builders<News>.Filter.Regex(x => x.Title, 
            new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
        Builders<News>.Filter.Regex(x => x.Description, 
            new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
        Builders<News>.Filter.Regex(x => x.Content, 
            new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
    );

    return await _news.Find(filter)
                     .SortByDescending(x => x.Date)
                     .ToListAsync();
}

        public async Task<List<News>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _news.Find(x => x.Date >= startDate && x.Date <= endDate)
                             .SortByDescending(x => x.Date)
                             .ToListAsync();
        }
    }
}