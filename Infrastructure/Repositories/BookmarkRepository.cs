using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class BookmarkRepository : IBookmarkRepository
{
    private readonly IMongoCollection<Bookmark> _bookmarks;

    public BookmarkRepository(IMongoDatabase database)
    {
        _bookmarks = database.GetCollection<Bookmark>("bookmarks");
    }

    public async Task<List<Bookmark>> GetByUserAsync(string userId)
        => await _bookmarks.Find(b => b.UserId == userId)
            .SortByDescending(b => b.CreatedAtUtc)
            .ToListAsync();

    public async Task<Bookmark?> GetByIdAsync(string id)
        => await _bookmarks.Find(b => b.Id == id).FirstOrDefaultAsync();

    public async Task<Bookmark?> GetByUserAndItemAsync(string userId, string itemId, BookmarkItemType itemType)
        => await _bookmarks.Find(b => b.UserId == userId && b.ItemId == itemId && b.ItemType == itemType)
            .FirstOrDefaultAsync();

    public async Task CreateAsync(Bookmark bookmark)
        => await _bookmarks.InsertOneAsync(bookmark);

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        var res = await _bookmarks.DeleteOneAsync(b => b.Id == id && b.UserId == userId);
        return res.DeletedCount == 1;
    }

    public async Task DeleteByUserAndItemAsync(string userId, string itemId, BookmarkItemType itemType)
        => await _bookmarks.DeleteOneAsync(b => b.UserId == userId && b.ItemId == itemId && b.ItemType == itemType);
}

