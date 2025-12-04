using Core.Interfaces;
using System.Linq;
using Core.Dtos.Startups;
using Core.Models;
using Application.Mappers;
using System.IO;

namespace Application.Services
{
    public class StartupService
    {
        private readonly IStartupRepository _repo;
        private readonly IFileStorageService _fileStorage;

        public StartupService(IStartupRepository repo, IFileStorageService fileStorage)
        {
            _repo = repo;
            _fileStorage = fileStorage;
        }
        public async Task<List<StartupResponseDto>> GetAllAsync(
            string? search = null,
            string? industry = null,
            string? subIndustry = null,
            string? city = null)
        {
            var list = await _repo.GetAllAsync(search, industry, subIndustry, city);
            return list.Select(StartupResponseDto.FromModel).ToList();
        }

        public async Task<StartupResponseDto?> GetByIdAsync(string id)
        {
            var startup = await _repo.GetByIdAsync(id);
            return startup == null ? null : StartupResponseDto.FromModel(startup);
        }

        /// <summary>
        /// Creates a startup, optionally uploading a pitch deck file to object storage.
        /// The controller should pass the file stream + content type (if any).
        /// </summary>
        public async Task CreateAsync(
            CreateStartupDto dto,
            Stream? pitchDeckStream = null,
            string? pitchDeckContentType = null,
            CancellationToken ct = default)
        {
            var startupId = Guid.NewGuid().ToString();

            var model = StartupMapper.ToModel(dto);
            model.Id = startupId;

            if (pitchDeckStream != null && !string.IsNullOrEmpty(pitchDeckContentType))
            {
                var key = $"startups/{startupId}/pitchdeck";

                var uploadedKey = await _fileStorage.UploadAsync(
                    pitchDeckStream,
                    pitchDeckContentType,
                    key,
                    ct);

                model.PitchDeckKey = uploadedKey;
            }

            await _repo.AddAsync(model);
        }


        /// <summary>
        /// Updates a startup. Optionally replaces the pitch deck file.
        /// If a new file is provided, the old one can be deleted (optional).
        /// </summary>
        public async Task<bool> UpdateAsync(
            string id,
            UpdateStartupDto dto,
            Stream? newPitchDeckStream = null,
            string? newPitchDeckContentType = null,
            CancellationToken ct = default)
        {
            var model = await _repo.GetByIdAsync(id);
            if (model == null) return false;

            StartupMapper.UpdateModel(model, dto);

            if (newPitchDeckStream != null && !string.IsNullOrEmpty(newPitchDeckContentType))
            {
                // optional: delete old file
                if (!string.IsNullOrEmpty(model.PitchDeckKey))
                {
                    await _fileStorage.DeleteAsync(model.PitchDeckKey, ct);
                }

                var key = $"startups/{model.Id}/pitchdeck";
                var uploadedKey = await _fileStorage.UploadAsync(
                    newPitchDeckStream,
                    newPitchDeckContentType,
                    key,
                    ct);

                model.PitchDeckKey = uploadedKey;
            }

            return await _repo.UpdateAsync(model);
        }


        public Task<bool> DeleteAsync(string id)
        {
            // You might also want to:
            // - load the startup
            // - delete related files from storage via _fileStorage.DeleteAsync(key)
            // - then delete startup itself
            return _repo.DeleteAsync(id);
        }
        public async Task<string?> GetPitchDeckUrlAsync(string id, CancellationToken ct = default)
        {
            var startup = await _repo.GetByIdAsync(id);
            if (startup == null || string.IsNullOrEmpty(startup.PitchDeckKey))
                return null;

            return await _fileStorage.GetDownloadUrlAsync(
                startup.PitchDeckKey,
                TimeSpan.FromMinutes(10),
                ct);
        }   
    }
}
