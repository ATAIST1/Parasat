using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.Investment
{
    public class CreateInvestmentRequestDto
    {
        public string StartupId { get; set; } = null!;
        [Required] public string Title { get; set; } = null!;
        [Required] public string Industry { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Description { get; set; } = null!;

        public int NumberOfEmployees { get; set; }
        public int? YearOfFoundation { get; set; }
        public string? InvestmentPurpose { get; set; }
        public long RevenueLastYear { get; set; }
        public long ProfitLastYear { get; set; }
        public long InvestmentNeeded { get; set; }
        [Range(1, 99)] public int EquityOfferedPercent { get; set; }
    }
}