using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.ClubMembership
{
    public class DecideClubMembershipApplicationDto
    {
        [StringLength(500)]
        public string? Comment { get; set; }
    }
}
