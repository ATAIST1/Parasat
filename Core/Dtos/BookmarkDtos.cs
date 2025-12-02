using System;

namespace Core.Dtos;

public class BookmarkDto
{
    public string Id { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public string ItemId { get; set; } = null!;
    public string ItemType { get; set; } = null!;
    public DateTime CreatedAtUtc { get; set; }
}

public class CreateBookmarkDto
{
    public string UserId { get; set; } = null!;
    public string ItemId { get; set; } = null!;
    public string ItemType { get; set; } = null!;
}

