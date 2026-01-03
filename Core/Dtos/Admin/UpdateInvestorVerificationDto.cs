using Core.Models;

namespace Core.Dtos.Admin
{
    public class UpdateInvestorVerificationDto
    {
        public InvestorVerificationStatus Status { get; set; }
        public string? Note { get; set; }
    }
}
