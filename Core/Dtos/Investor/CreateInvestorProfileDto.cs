using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.Investor
{
    public class CreateInvestorProfileDto
    {
        [Required] public string FullName { get; set; } = null!;

        [Required] public string About { get; set; } = null!;

        [Required] public string Description { get; set; } = null!;

        [Required] public string City { get; set; } = null!;

        [Required] public List<string> Industries { get; set; } = new();

        [Required] public List<string> Models { get; set; } = new();

        [Required] public string Currency { get; set; } = "KZT";

        [Required] public string InvestmentRange { get; set; } = null!;

        [Required] public int DealCount { get; set; }
    }
}
