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
        public string? Telegram { get; set; }
        public string? Phone { get; set; }
        public string? Linkedin { get; set; }
        public string? Github { get; set; }

        public List<DevType> Types { get; set; } = new(); // Full-Stack, Frontend и т.д.
        public string City { get; set; } = null!;
        public bool IsRemote { get; set; } = false;

        public List<string> TechStack { get; set; } = new(); // React, Node.js, Python и т.д.

        public ExperienceLevel Experience { get; set; }

        public string? About { get; set; }
        public bool IsAvailable { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum DevType
    {
        FullStack,
        Frontend,
        Backend,
        Mobile,
        AIML,
        DevOps,
        UIUX,
        QA
    }

    public enum ExperienceLevel
    {
        Junior,      // 1-2 года
        Middle,      // 3-4 года
        Senior,      // 5+ лет
        Lead         // 10+ лет
    }
}