using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Dtos
{
    public class UpdateNewsDto
    {
        [StringLength(200, MinimumLength = 5)]
        public string? Title { get; set; }
        
        [MinLength(20)]
        public string? Content { get; set; }
        
        [StringLength(300)]
        public string? Description { get; set; }
        
        public string? Category { get; set; }
        
        public string? Badge { get; set; }
        
        public bool? IsFeatured { get; set; }
        
        public DateTime? Date { get; set; }
    }
}