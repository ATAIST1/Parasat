using Core.Models;

namespace Core.Dtos.Investor
{
    public class InvestorProfileResponseDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;

        public string FullName { get; set; } = null!;
        public string About { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string City { get; set; } = null!;

        public List<string> Industries { get; set; } = new();
        public List<string> Models { get; set; } = new();

        public string Currency { get; set; } = null!;
        public string InvestmentRange { get; set; } = null!;
        public int DealCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Telegram { get; set; }

        public static InvestorProfileResponseDto FromModel(InvestorProfile model)
        {
            return new InvestorProfileResponseDto
            {
                Id = model.Id ?? "",
                UserId = model.UserId,
                FullName = model.FullName,
                About = model.About,
                Description = model.Description,
                City = model.City,
                Industries = model.Industries,
                Models = model.Models,
                Currency = model.Currency,
                InvestmentRange = model.InvestmentRange,
                DealCount = model.DealCount,
                CreatedAt = model.CreatedAt
            };
        }
    }
}
