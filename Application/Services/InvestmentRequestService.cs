using Application.Mappers;
using Core.Dtos.Investment;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Http;
using System.Threading;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class InvestmentRequestService
    {
        private readonly IInvestmentRequestRepository _repo;
        private readonly IFileStorageService _fileStorage;

        public InvestmentRequestService(
            IInvestmentRequestRepository repo,
            IFileStorageService fileStorage)
        {
            _repo = repo;
            _fileStorage = fileStorage;
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
        public async Task CreateAsync(
            CreateInvestmentRequestDto dto,
            string userId,
            IFormFile? investmentMemorandum,
            IFormFile? financialReport,
            IFormFile? businessPlan,
            IFormFile? presentation,
            List<IFormFile>? otherDocuments,
            CancellationToken ct = default)
        {
            // генерим Id сразу, чтобы использовать в ключах S3
            var id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();

            var request = InvestmentRequestMapper.ToModel(dto, userId);
            request.Id = id;

            // базовый префикс
            var prefix = $"investment_requests/{id}/";

            // helper
            async Task<string?> UploadIfNotNull(IFormFile? file, string subfolder)
            {
                if (file == null || file.Length == 0) return null;

                var key = $"{prefix}{subfolder}/{Guid.NewGuid()}_{file.FileName}";

                await using var stream = file.OpenReadStream();
                await _fileStorage.UploadAsync(stream, file.ContentType, key, ct);
                return key;
            }

            request.InvestmentMemorandumKey = await UploadIfNotNull(investmentMemorandum, "memorandum");
            request.FinancialReportKey = await UploadIfNotNull(financialReport, "financial-report");
            request.BusinessPlanKey = await UploadIfNotNull(businessPlan, "business-plan");
            request.PresentationKey = await UploadIfNotNull(presentation, "presentation");

            if (otherDocuments != null && otherDocuments.Count > 0)
            {
                foreach (var file in otherDocuments)
                {
                    if (file == null || file.Length == 0) continue;

                    var key = $"{prefix}other/{Guid.NewGuid()}_{file.FileName}";
                    await using var stream = file.OpenReadStream();
                    await _fileStorage.UploadAsync(stream, file.ContentType, key, ct);
                    request.OtherDocumentsKeys.Add(key);
                }
            }

            await _repo.AddAsync(request);
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
