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
        private readonly IFileStorage _fileStorage;

        public StartupService(IStartupRepository repo, IFileStorage fileStorage)
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
            string? pitchDeckContentType = null)
        {
            // generate id here so we can use it in the storage key
            var startupId = Guid.NewGuid().ToString();

            var model = StartupMapper.ToModel(dto);
            model.Id = startupId;

            // If we got a file, upload it and store the key in the model
            if (pitchDeckStream != null && !string.IsNullOrEmpty(pitchDeckContentType))
            {
                var key = $"startups/{startupId}/pitchdeck";

                // extension is optional, you can append ".pdf" or use something from dto
                var uploadedKey = await _fileStorage.UploadAsync(
                    pitchDeckStream,
                    pitchDeckContentType,
                    key);

                // TODO: adjust property name to match your actual model field
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
            string? newPitchDeckContentType = null)
        {
            var model = await _repo.GetByIdAsync(id);
            if (model == null) return false;

            // update simple fields
            StartupMapper.UpdateModel(model, dto);

            // If a new file is provided, optionally delete old file and upload new one
            if (newPitchDeckStream != null && !string.IsNullOrEmpty(newPitchDeckContentType))
            {
                // OPTIONAL: delete old file if it exists
                if (!string.IsNullOrEmpty(model.PitchDeckKey))
                {
                    await _fileStorage.DeleteAsync(model.PitchDeckKey);
                }

                var key = $"startups/{model.Id}/pitchdeck";
                var uploadedKey = await _fileStorage.UploadAsync(
                    newPitchDeckStream,
                    newPitchDeckContentType,
                    key);

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
    }
}
