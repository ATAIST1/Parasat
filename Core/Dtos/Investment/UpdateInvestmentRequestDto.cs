namespace Core.Dtos.Investment
{
    public class UpdateInvestmentRequestDto
    {
        public string? Title { get; set; }
        public string? Industry { get; set; }
        public string? City { get; set; }
        public string? Description { get; set; }

        public long? RevenueLastYear { get; set; }
        public long? ProfitLastYear { get; set; }
        public long? InvestmentNeeded { get; set; }
        public int? EquityOfferedPercent { get; set; }
        public int? NumberOfEmployees { get; set; }
        public int? YearOfFoundation { get; set; }
        public string? InvestmentPurpose { get; set; }
        
    }
}