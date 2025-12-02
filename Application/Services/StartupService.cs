using Core.Interfaces;
using System.Linq;
using Core.Dtos.Startups;
using Core.Models;
using Application.Mappers;

namespace Application.Services
{
    public class StartupService
    {
        private readonly IStartupRepository _repo;

        public StartupService(IStartupRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<StartupResponseDto>> GetAllAsync(
            string? search = null,
            string? industry = null,
            string? city = null)
        {
            var list = await _repo.GetAllAsync(search, industry, city);
            return list.Select(StartupResponseDto.FromModel).ToList();
        }

//         public async Task<List<StartupResponseDto>> GetAllAsync()
//         {
//             var list = await _repo.GetAllAsync();
//             return list.Select(StartupResponseDto.FromModel).ToList();
//         }

        public async Task<StartupResponseDto?> GetByIdAsync(string id)
        {
            var startup = await _repo.GetByIdAsync(id);
            return startup == null ? null : StartupResponseDto.FromModel(startup);
        }

        public async Task CreateAsync(CreateStartupDto dto)
        {
            var model = StartupMapper.ToModel(dto);
            await _repo.AddAsync(model);
        }

        public async Task<bool> UpdateAsync(string id, UpdateStartupDto dto)
        {
            var model = await _repo.GetByIdAsync(id);
            if (model == null) return false;

            StartupMapper.UpdateModel(model, dto);
            return await _repo.UpdateAsync(model);
        }

        public Task<bool> DeleteAsync(string id)
        {
            return _repo.DeleteAsync(id);
        }
    }
}
