using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public class Bookmark
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;
    [BsonRepresentation(BsonType.ObjectId)]
    public string ItemId { get; set; } = null!;
    public BookmarkItemType ItemType { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

public enum BookmarkItemType
{
    Startup = 0,
    Investor = 1,
    Developer = 2,
    Business = 3
}