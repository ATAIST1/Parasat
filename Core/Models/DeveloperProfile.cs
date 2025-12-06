using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models
{
    public class DeveloperProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        
        public string? Id { get; set; }

        public string UserId { get; set; } = null!; // ссылка на User.Id

        public string FullName { get; set; } = null!;
        public int? WorkingRate { get; set; }
        public string? Currency { get; set; }
        public string? FirstLink { get; set; }
        public string? SecondLink { get; set; }

        public List<string> Types { get; set; } = new(); // Full-Stack, Frontend и т.д.
        public string City { get; set; } = null!;
        public bool IsRemote { get; set; } = false;
        public int? ProjectCount { get; set; }

        public List<string> TechStack { get; set; } = new();

        public string Experience { get; set; }

        public string? About { get; set; }
        public bool IsAvailable { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

}