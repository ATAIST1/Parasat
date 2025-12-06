using Application.Mappers;
using Core.Dtos.Investment;
using Core.Interfaces;
using Core.Models;

namespace Application.Services
{
    public class InvestmentRequestService
    {
        private readonly IInvestmentRequestRepository _repo;

        public InvestmentRequestService(IInvestmentRequestRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<InvestmentRequestResponseDto>> GetAllAsync(
            string? search = null,
            string? industry = null,
            string? profitRange = null,
            string? equityRange = null)
        {
            var requests = await _repo.GetAllAsync(search, industry, profitRange, equityRange);
            return requests.Select(InvestmentRequestMapper.ToResponseDto).ToList();
        }

        public async Task<List<InvestmentRequestResponseDto>> GetAllAsync()
        {
            var requests = await _repo.GetAllAsync();
            return requests.Select(InvestmentRequestMapper.ToResponseDto).ToList();
        }

        public async Task<InvestmentRequestResponseDto?> GetByIdAsync(string id)
        {
            var request = await _repo.GetByIdAsync(id);
            return request == null ? null : InvestmentRequestMapper.ToResponseDto(request);
        }

        public async Task CreateAsync(CreateInvestmentRequestDto dto, string userId)
        {
            var request = InvestmentRequestMapper.ToModel(dto, userId);
            await _repo.AddAsync(request);
        }

        public async Task<bool> UpdateAsync(string id, UpdateInvestmentRequestDto dto, string userId)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return false;

            InvestmentRequestMapper.UpdateModel(existing, dto);
            return await _repo.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(string id, string userId)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return false;

            return await _repo.DeleteAsync(id);
        }

        public async Task<bool> PublishAsync(string id, string userId)
        {
            var request = await _repo.GetByIdAsync(id);
            if (request == null || request.UserId != userId) return false;

            return await _repo.UpdateAsync(request);
        }


        /* public async Task<bool> PublishAsync(string id, string userId)
        {
            var request = await _repo.GetByIdAsync(id);
            if (request == null || request.UserId != userId) return false;
            if (request.Status != InvestmentRequestStatus.Draft) return false;

            request.Status = InvestmentRequestStatus.Published;
            request.PublishedAt = DateTime.UtcNow;

            return await _repo.UpdateAsync(request);
        } */
    }
}
