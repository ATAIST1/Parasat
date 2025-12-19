using Core.Dtos.ClubMembership;
using Core.Models;

namespace Application.Mappers
{
    public static class ClubMembershipMapper
    {
        public static ClubMembershipApplication ToModel(CreateClubMembershipApplicationDto dto, string userId)
        {
            return new ClubMembershipApplication
            {
                UserId = userId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Industry = dto.Industry,
                Position = dto.Position,
                Motivation = dto.Motivation,
                Status = ClubMembershipStatus.Pending,
                CreatedAtUtc = DateTime.UtcNow
            };
        }

        public static ClubMembershipApplicationResponseDto ToResponseDto(ClubMembershipApplication model)
            => ClubMembershipApplicationResponseDto.FromModel(model);
    }
}
