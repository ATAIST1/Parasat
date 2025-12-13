using Application.Mappers;
using Core.Dtos.Developer;
using Core.Interfaces;
using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public class DeveloperProfileService
    {
        private readonly IDeveloperProfileRepository _repo;

        public DeveloperProfileService(IDeveloperProfileRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<DeveloperProfileResponseDto>> GetAllAsync()
        {
            var profiles = await _repo.GetAllAsync();
            return profiles.Select(DeveloperProfileMapper.ToResponseDto).ToList();
        }

        public async Task<DeveloperProfileResponseDto?> GetByIdAsync(string id)
        {
            var profile = await _repo.GetByIdAsync(id);
            return profile == null ? null : DeveloperProfileMapper.ToResponseDto(profile);
        }

        public async Task<DeveloperProfileResponseDto?> GetByUserIdAsync(string userId)
        {
            var profile = await _repo.GetByUserIdAsync(userId);
            return profile == null ? null : DeveloperProfileMapper.ToResponseDto(profile);
        }

        public async Task CreateAsync(string userId, CreateDeveloperProfileDto dto)
        {
            var profile = DeveloperProfileMapper.ToModel(userId, dto);
            profile.UserId = userId;
            await _repo.AddAsync(profile);
        }


        public async Task<bool> UpdateAsync(string currentUserId, string id, UpdateDeveloperProfileDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            if (existing.UserId != currentUserId)
                throw new UnauthorizedAccessException("Not owner");

            DeveloperProfileMapper.UpdateModel(existing, dto);
            existing.UpdatedAt = DateTime.UtcNow;
            return await _repo.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(string currentUserId, string id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            if (existing.UserId != currentUserId)
                throw new UnauthorizedAccessException("Not owner");

            return await _repo.DeleteAsync(id);
        }
        public async Task<List<DeveloperProfileResponseDto>> SearchAsync(
            List<string>? types = null,
            string? city = null,
            bool? isRemote = null,
            List<string>? techStack = null,
            string? experience = null,
            bool? isAvailable = null)
        {
            var profiles = await _repo.SearchAsync(types, city, isRemote, techStack, experience, isAvailable);
            return profiles.Select(DeveloperProfileMapper.ToResponseDto).ToList();
        }

    }
}