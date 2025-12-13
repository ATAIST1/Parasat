using Core.Models;
using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.Developer
{
    public class CreateDeveloperProfileDto
    {
        [Required] public string FullName { get; set; } = null!;
        public int? WorkingRate { get; set; }
        public string? Currency { get; set; }
        public string? FirstLink { get; set; }
        public string? SecondLink { get; set; }

        [Required] public List<string> Types { get; set; } = new();
        [Required] public string City { get; set; } = null!;
        public bool IsRemote { get; set; }

        [Required] public List<string> TechStack { get; set; } = new();

        [Required] public string Experience { get; set; } = null!;

        public string? About { get; set; }
        public bool IsAvailable { get; set; } = true;
        public int? ProjectCount { get; set; }
    }
}