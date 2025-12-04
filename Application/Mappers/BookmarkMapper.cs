using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class BookmarkMapper
{
    public static BookmarkDto ToDto(Bookmark bookmark)
    {
        return new BookmarkDto
        {
            Id = bookmark.Id,
            UserId = bookmark.UserId,
            ItemId = bookmark.ItemId,
            ItemType = bookmark.ItemType,
            CreatedAtUtc = bookmark.CreatedAtUtc
        };
    }

    public static Bookmark ToModel(CreateBookmarkDto dto, string userId)
    {
        return new Bookmark
        {
            UserId = userId,
            ItemId = dto.ItemId,
            ItemType = dto.ItemType
        };
    }
}

