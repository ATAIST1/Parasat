namespace Core.Dtos.Developer
{
    public class UpdateDeveloperProfileDto
    {
        public string? FullName { get; set; }
        public string? Telegram { get; set; }
        public string? Phone { get; set; }
        public string? Linkedin { get; set; }
        public string? Github { get; set; }

        public List<string>? Types { get; set; }
        public string? City { get; set; }
        public bool? IsRemote { get; set; }

        public List<string>? TechStack { get; set; }
        public string? Experience { get; set; }

        public string? About { get; set; }
        public bool? IsAvailable { get; set; }
    }
}