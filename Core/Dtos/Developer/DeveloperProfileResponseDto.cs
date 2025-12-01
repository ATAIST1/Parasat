using Core.Models;

namespace Core.Dtos.Developer
{
    public class DeveloperProfileResponseDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? Telegram { get; set; }
        public string? Phone { get; set; }
        public string? Linkedin { get; set; }
        public string? Github { get; set; }

        public List<DevType> Types { get; set; } = new();
        public string City { get; set; } = null!;
        public bool IsRemote { get; set; }
        public List<string> TechStack { get; set; } = new();
        public ExperienceLevel Experience { get; set; }
        public string? About { get; set; }
        public bool IsAvailable { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public static DeveloperProfileResponseDto FromModel(DeveloperProfile model)
        {
            return new DeveloperProfileResponseDto
            {
                Id = model.Id ?? "",
                UserId = model.UserId,
                FullName = model.FullName,
                Telegram = model.Telegram,
                Phone = model.Phone,
                Linkedin = model.Linkedin,
                Github = model.Github,
                Types = model.Types,
                City = model.City,
                IsRemote = model.IsRemote,
                TechStack = model.TechStack,
                Experience = model.Experience,
                About = model.About,
                IsAvailable = model.IsAvailable,
                CreatedAt = model.CreatedAt,
                UpdatedAt = model.UpdatedAt
            };
        }
    }
}