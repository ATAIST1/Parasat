using Core.Models;

namespace Core.Dtos.ClubMembership
{
    public class ClubMembershipApplicationResponseDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;

        public string? Industry { get; set; }
        public string? Position { get; set; }
        public string? Motivation { get; set; }

        public string Status { get; set; } = null!;

        public DateTime CreatedAtUtc { get; set; }
        public DateTime? DecisionAtUtc { get; set; }
        public string? DecisionComment { get; set; }

        public static ClubMembershipApplicationResponseDto FromModel(ClubMembershipApplication m)
        {
            return new ClubMembershipApplicationResponseDto
            {
                Id = m.Id ?? "",
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                Email = m.Email,
                Phone = m.Phone,
                Industry = m.Industry,
                Position = m.Position,
                Motivation = m.Motivation,
                Status = m.Status.ToString(),
                CreatedAtUtc = m.CreatedAtUtc,
                DecisionAtUtc = m.DecisionAtUtc,
                DecisionComment = m.DecisionComment
            };
        }
    }
}
