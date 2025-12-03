using System;
using Core.Models;

namespace Core.Dtos;

public class BookmarkDto
{
    public string Id { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public string ItemId { get; set; } = null!;
    public BookmarkItemType ItemType { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class CreateBookmarkDto
{
    public string ItemId { get; set; } = null!;
    public BookmarkItemType ItemType { get; set; }
}

