using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Dtos
{
    public class CreateNewsDto
    {
        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Title { get; set; } = null!;
        
        [Required]
        [MinLength(20)]
        public string Content { get; set; } = null!;
        
        [Required]
        [StringLength(300)]
        public string Description { get; set; } = null!;
        
        [Required]
        public string Category { get; set; } = null!;
        
        [Required]
        [Url]
        public string ImageUrl { get; set; } = null!;
        
        [Required]
        public string Badge { get; set; } = null!;
        
        public bool IsFeatured { get; set; }
        
        public DateTime? Date { get; set; }
    }
}