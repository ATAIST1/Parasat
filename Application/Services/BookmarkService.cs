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

    public async Task<BookmarkDto?> CreateAsync(CreateBookmarkDto dto)
    {
        var existing = await _repository.GetByUserAndItemAsync(dto.UserId, dto.ItemId, dto.ItemType);
        if (existing != null)
        {
            return BookmarkMapper.ToDto(existing);
        }

        var bookmark = BookmarkMapper.ToModel(dto);
        await _repository.CreateAsync(bookmark);
        return BookmarkMapper.ToDto(bookmark);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
        {
            return false;
        }

        await _repository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> DeleteByUserAndItemAsync(string userId, string itemId, string itemType)
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

