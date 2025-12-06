namespace Core.Dtos.Developer
{
    public class UpdateDeveloperProfileDto
    {
        public string? FullName { get; set; }
        public int? WorkingRate { get; set; }
        public string? Currency { get; set; }
        public string? FirstLink { get; set; }
        public string? SecondLink { get; set; }

        public List<string>? Types { get; set; }
        public string? City { get; set; }
        public bool? IsRemote { get; set; }

        public List<string>? TechStack { get; set; }
        public string? Experience { get; set; }

        public int? ProjectCount { get; set; }
        public string? About { get; set; }
        public bool? IsAvailable { get; set; }
    }
}