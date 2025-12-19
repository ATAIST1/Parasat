using Application.Mappers;
using Core.Dtos.ClubMembership;
using Core.Interfaces;
using Core.Models;

namespace Application.Services
{
    public class ClubMembershipService
    {
        private readonly IClubMembershipRepository _repo;

        public ClubMembershipService(IClubMembershipRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ClubMembershipApplicationResponseDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(ClubMembershipMapper.ToResponseDto).ToList();
        }

        public async Task<ClubMembershipApplicationResponseDto?> GetMyAsync(string userId)
        {
            var item = await _repo.GetLatestByUserIdAsync(userId);
            return item == null ? null : ClubMembershipMapper.ToResponseDto(item);
        }

        public async Task CreateAsync(CreateClubMembershipApplicationDto dto, string userId)
        {
            var active = await _repo.GetActiveOrPendingByUserIdAsync(userId);
            if (active != null)
            {
                throw new InvalidOperationException("У вас уже есть активная или ожидающая заявка.");
            }

            var model = ClubMembershipMapper.ToModel(dto, userId);
            await _repo.AddAsync(model);
        }

        public async Task<bool> ApproveAsync(string id, string decidedByUserId, string? comment)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return false;

            item.Status = ClubMembershipStatus.Approved;
            item.DecisionAtUtc = DateTime.UtcNow;
            item.DecidedByUserId = decidedByUserId;
            item.DecisionComment = comment;

            return await _repo.UpdateAsync(item);
        }

        public async Task<bool> RejectAsync(string id, string decidedByUserId, string? comment)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return false;

            item.Status = ClubMembershipStatus.Rejected;
            item.DecisionAtUtc = DateTime.UtcNow;
            item.DecidedByUserId = decidedByUserId;
            item.DecisionComment = comment;

            return await _repo.UpdateAsync(item);
        }
    }
}
