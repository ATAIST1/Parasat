using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public class Investor
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Bio { get; set; } = null!;
    public string CheckSize { get; set; } = null!; // e.g., "$50K - $500K"
    public List<string> Industries { get; set; } = new();
    public string Deals { get; set; } = string.Empty;
    public string Exits { get; set; } = string.Empty;
    public bool Verified { get; set; }
}

