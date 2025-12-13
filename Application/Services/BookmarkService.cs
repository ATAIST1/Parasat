using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;

namespace Application.Services;

public class BookmarkService
{
    private readonly IBookmarkRepository _repository;

    public BookmarkService(IBookmarkRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<BookmarkDto>> GetByUserAsync(string userId)
    {
        var bookmarks = await _repository.GetByUserAsync(userId);
        return bookmarks.Select(BookmarkMapper.ToDto).ToList();
    }

    public async Task<BookmarkDto?> CreateAsync(CreateBookmarkDto dto, string userId)
    {
        var existing = await _repository.GetByUserAndItemAsync(userId, dto.ItemId, dto.ItemType);
        if (existing != null)
        {
            return BookmarkMapper.ToDto(existing);
        }

        var bookmark = BookmarkMapper.ToModel(dto, userId);
        await _repository.CreateAsync(bookmark);
        return BookmarkMapper.ToDto(bookmark);
    }

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        return await _repository.DeleteAsync(id, userId);
    }

    public async Task<bool> DeleteByUserAndItemAsync(string userId, string itemId, Core.Models.BookmarkItemType itemType)
    {
        var existing = await _repository.GetByUserAndItemAsync(userId, itemId, itemType);
        if (existing == null)
        {
            return false;
        }

        await _repository.DeleteByUserAndItemAsync(userId, itemId, itemType);
        return true;
    }
}

