namespace Core.Dtos.Investor
{
    public class UpdateInvestorProfileDto
    {
        public string? FullName { get; set; }
        public string? About { get; set; }
        public string? Description { get; set; }
        public string? City { get; set; }

        public List<string>? Industries { get; set; }
        public List<string>? Models { get; set; }

        public string? Currency { get; set; }
        public string? InvestmentRange { get; set; }
        public int? DealCount { get; set; }
    }
}
