using Core.Models;

namespace Core.Dtos.Admin
{
    public class UpdateVerificationDto
    {
        public VerificationStatus Status { get; set; }
        public string? Note { get; set; }
    }
}

