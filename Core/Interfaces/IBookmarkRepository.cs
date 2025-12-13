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
    Task<bool> DeleteAsync(string id, string userId);

    Task DeleteByUserAndItemAsync(string userId, string itemId, BookmarkItemType itemType);
}


