using Application.Mappers;
using Core.Dtos.Investor;
using Core.Interfaces;
using Core.Models;

namespace Application.Services
{
    public class InvestorProfileService
    {
        private readonly IInvestorProfileRepository _repo;

        public InvestorProfileService(IInvestorProfileRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<InvestorProfileResponseDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(InvestorProfileMapper.ToResponseDto).ToList();
        }

        public async Task<InvestorProfileResponseDto?> GetByIdAsync(string id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item == null ? null : InvestorProfileMapper.ToResponseDto(item);
        }

        public async Task<InvestorProfileResponseDto?> GetByUserIdAsync(string userId)
        {
            var item = await _repo.GetByUserIdAsync(userId);
            return item == null ? null : InvestorProfileMapper.ToResponseDto(item);
        }

        public async Task CreateAsync(CreateInvestorProfileDto dto, string userId)
        {
            var existing = await _repo.GetByUserIdAsync(userId);
            /*if (existing != null)
            {
                throw new InvalidOperationException("Профиль инвестора уже существует для этого пользователя.");
            }*/

            var model = InvestorProfileMapper.ToModel(dto, userId);
            await _repo.AddAsync(model);
        }

        public async Task<bool> UpdateAsync(string id, UpdateInvestorProfileDto dto, string userId)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return false;

            InvestorProfileMapper.UpdateModel(existing, dto);
            return await _repo.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(string id, string userId)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return false;

            return await _repo.DeleteAsync(id);
        }
    }
}