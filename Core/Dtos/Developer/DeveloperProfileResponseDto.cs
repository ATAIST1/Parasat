using Core.Models;

namespace Core.Dtos.Developer
{
    public class DeveloperProfileResponseDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public int? WorkingRate { get; set; }
        public string? Currency { get; set; }
        public string? FirstLink { get; set; }
        public string? SecondLink { get; set; }

        public List<string> Types { get; set; } = new();
        public string City { get; set; } = null!;
        public bool IsRemote { get; set; }
        public List<string> TechStack { get; set; } = new();
        public string Experience { get; set; }
        public string? About { get; set; }
        public bool IsAvailable { get; set; }
        public int? ProjectCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public static DeveloperProfileResponseDto FromModel(DeveloperProfile model)
        {
            return new DeveloperProfileResponseDto
            {
                Id = model.Id ?? "",
                UserId = model.UserId,
                FullName = model.FullName,
                WorkingRate = model.WorkingRate,
                Currency = model.Currency,
                FirstLink = model.FirstLink,
                SecondLink = model.SecondLink,
                Types = model.Types,
                City = model.City,
                IsRemote = model.IsRemote,
                TechStack = model.TechStack,
                Experience = model.Experience,
                About = model.About,
                IsAvailable = model.IsAvailable,
                ProjectCount = model.ProjectCount,
                CreatedAt = model.CreatedAt,
                UpdatedAt = model.UpdatedAt
            };
        }
    }
}