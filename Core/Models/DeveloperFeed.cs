using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public class DeveloperFeed
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!; // Full-Stack разработка, AI/ML разработка, Мобильная разработка
    public string Location { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<string> Stack { get; set; } = new();
    public string Projects { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string Rate { get; set; } = null!; //
    public bool Available { get; set; }
}



