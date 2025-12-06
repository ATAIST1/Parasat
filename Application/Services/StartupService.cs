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
            string? evidence = null,
            string? city = null)
        {
            var list = await _repo.GetAllAsync(search, industry, evidence, city);
            return list.Select(StartupResponseDto.FromModel).ToList();
        }

        public async Task<StartupResponseDto?> GetByIdAsync(string id)
        {
            var startup = await _repo.GetByIdAsync(id);
            return startup == null ? null : StartupResponseDto.FromModel(startup);
        }

        /// <summary>
        /// Создание стартапа + опциональная загрузка pitch deck и financial model в сторидж.
        /// </summary>
        public async Task CreateAsync(
            CreateStartupDto dto,
            Stream? pitchDeckStream = null,
            string? pitchDeckContentType = null,
            Stream? financialModelStream = null,
            string? financialModelContentType = null,
            CancellationToken ct = default)
        {

            var model = StartupMapper.ToModel(dto);

            if (dto.Technologies != null)
                model.Technologies = dto.Technologies;
            if (dto.Stage != null)
                model.Stage = dto.Stage;
            if (dto.Model != null)
                model.Model = dto.Model;
            if (dto.ExternalLinks != null)
                model.ExternalLinks = dto.ExternalLinks;

            await _repo.AddAsync(model);
            var startupId = model.Id;

            // Pitch deck
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

            // Financial model
            if (financialModelStream != null && !string.IsNullOrEmpty(financialModelContentType))
            {
                var key = $"startups/{startupId}/financial-model";

                var uploadedKey = await _fileStorage.UploadAsync(
                    financialModelStream,
                    financialModelContentType,
                    key,
                    ct);

                model.FinancialModelKey = uploadedKey;
            }

            // Update the startup with file keys if any files were uploaded
            if (model.PitchDeckKey != null || model.FinancialModelKey != null)
            {
                await _repo.UpdateAsync(model);
            }
        }

        /// <summary>
        /// Обновление стартапа. Можно заменить pitch deck и/или financial model.
        /// </summary>
        public async Task<bool> UpdateAsync(
            string id,
            UpdateStartupDto dto,
            Stream? newPitchDeckStream = null,
            string? newPitchDeckContentType = null,
            Stream? newFinancialModelStream = null,
            string? newFinancialModelContentType = null,
            CancellationToken ct = default)
        {
            var model = await _repo.GetByIdAsync(id);
            if (model == null) return false;

            StartupMapper.UpdateModel(model, dto);

            if (dto.Technologies != null)
                model.Technologies = dto.Technologies;
            if (dto.Stage != null)
                model.Stage = dto.Stage;
            if (dto.Model != null)
                model.Model = dto.Model;
            if (dto.ExternalLinks != null)
                model.ExternalLinks = dto.ExternalLinks;

            // Обновление pitch deck
            if (newPitchDeckStream != null && !string.IsNullOrEmpty(newPitchDeckContentType))
            {
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

            // Обновление financial model
            if (newFinancialModelStream != null && !string.IsNullOrEmpty(newFinancialModelContentType))
            {
                if (!string.IsNullOrEmpty(model.FinancialModelKey))
                {
                    await _fileStorage.DeleteAsync(model.FinancialModelKey, ct);
                }

                var key = $"startups/{model.Id}/financial-model";
                var uploadedKey = await _fileStorage.UploadAsync(
                    newFinancialModelStream,
                    newFinancialModelContentType,
                    key,
                    ct);

                model.FinancialModelKey = uploadedKey;
            }

            return await _repo.UpdateAsync(model);
        }

        public Task<bool> DeleteAsync(string id)
        {
            // по уму: достать стартап, удалить PitchDeckKey/FinancialModelKey из S3
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

        public async Task<string?> GetFinancialModelUrlAsync(string id, CancellationToken ct = default)
        {
            var startup = await _repo.GetByIdAsync(id);
            if (startup == null || string.IsNullOrEmpty(startup.FinancialModelKey))
                return null;

            return await _fileStorage.GetDownloadUrlAsync(
                startup.FinancialModelKey,
                TimeSpan.FromMinutes(10),
                ct);
        }
    }
}
