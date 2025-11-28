using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public class Startup
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
    public string Stage { get; set; } = null!; // MVP, PMF, Рост
    public string Industry { get; set; } = null!; // Fintech, EdTech, AgriTech
    public string Location { get; set; } = null!;
    public string Pitch { get; set; } = null!;
    public string Mrr { get; set; } = string.Empty; // Monthly Recurring Revenue
    public string Users { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
}

