using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IBookmarkRepository
{
    Task<List<Bookmark>> GetByUserAsync(string userId);
    Task<Bookmark?> GetByIdAsync(string id);
    Task<Bookmark?> GetByUserAndItemAsync(string userId, string itemId, BookmarkItemType itemType);
    Task CreateAsync(Bookmark bookmark);
    Task DeleteAsync(string id);
    Task DeleteByUserAndItemAsync(string userId, string itemId, BookmarkItemType itemType);
}


