using System.ComponentModel.DataAnnotations;

namespace Core.Dtos.ClubMembership
{
    public class CreateClubMembershipApplicationDto
    {
        [Required, StringLength(60, MinimumLength = 2)]
        public string FirstName { get; set; } = null!;

        [Required, StringLength(60, MinimumLength = 2)]
        public string LastName { get; set; } = null!;

        [Required, EmailAddress, StringLength(120)]
        public string Email { get; set; } = null!;

        [Required, StringLength(40, MinimumLength = 5)]
        public string Phone { get; set; } = null!;

        [StringLength(100)]
        public string? Industry { get; set; }

        [StringLength(100)]
        public string? Position { get; set; }

        [StringLength(4000)]
        public string? Motivation { get; set; }
    }
}
