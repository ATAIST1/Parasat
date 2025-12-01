using Core.Models;
using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.Developer
{
    public class CreateDeveloperProfileDto
    {
        [Required] public string UserId { get; set; } = null!;
        [Required] public string FullName { get; set; } = null!;
        public string? Telegram { get; set; }
        public string? Phone { get; set; }
        public string? Linkedin { get; set; }
        public string? Github { get; set; }

        [Required] public List<string> Types { get; set; } = new();           // ← string
        [Required] public string City { get; set; } = null!;
        public bool IsRemote { get; set; }

        [Required] public List<string> TechStack { get; set; } = new();

        [Required] public string Experience { get; set; } = null!;            // ← string!

        public string? About { get; set; }
        public bool IsAvailable { get; set; } = true;
    }
}