using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Core.Models
{
    public class News
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        
        public string Title { get; set; } = null!;
        
        public string Content { get; set; } = null!;
        
        public string Description { get; set; } = null!;
        
        public DateTime Date { get; set; }
        
        public string Category { get; set; } = null!; // Новость, Достижение, Партнерство, Рост
        
        public string ImageUrl { get; set; } = null!;
        
        public string Badge { get; set; } = null!; // Новое, Сделка, Рост, Партнерство
        
        [BsonDefaultValue(false)]
        public bool IsFeatured { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
    }
}