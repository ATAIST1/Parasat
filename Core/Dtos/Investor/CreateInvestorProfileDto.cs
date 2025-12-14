using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.Investor
{
    public class CreateInvestorProfileDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string FullName { get; set; } = null!;

        [Required]
        [StringLength(500)]
        public string About { get; set; } = null!;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = null!;

        [Required]
        [MinLength(1, ErrorMessage = "Выберите хотя бы одну отрасль")]
        public List<string> Industries { get; set; } = new();

        [Required]
        [MinLength(1, ErrorMessage = "Выберите хотя бы одну модель инвестирования")]
        public List<string> Models { get; set; } = new();

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "KZT";

        [Required]
        public string InvestmentRange { get; set; } = null!;

        [Required]
        [Range(0, 1000)]
        public int DealCount { get; set; }
    }
}
