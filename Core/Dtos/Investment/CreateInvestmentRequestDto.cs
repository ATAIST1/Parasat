using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.Investment
{
    public class CreateInvestmentRequestDto
    {
        [Required] public string StartupId { get; set; } = null!;
        [Required] public string Title { get; set; } = null!;
        [Required] public string Industry { get; set; } = null!;
        [Required] public string City { get; set; } = null!;
        [Required] public string Description { get; set; } = null!;

        [Required] public long RevenueLastYear { get; set; }
        [Required] public long ProfitLastYear { get; set; }
        [Required] public long InvestmentNeeded { get; set; }
        [Range(1, 99)] public int EquityOfferedPercent { get; set; }
    }
}