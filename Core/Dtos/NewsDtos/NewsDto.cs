using System;

namespace Core.Dtos
{
    public class NewsDto
    {
        public string Id { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Date { get; set; }
        public string Category { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public string Badge { get; set; } = null!;
        public bool IsFeatured { get; set; }
        public string FormattedDate => Date.ToString("dd MMMM yyyy");
    }
}