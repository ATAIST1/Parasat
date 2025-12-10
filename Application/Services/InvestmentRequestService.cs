using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Application.Mappers;
using Core.Dtos.Investment;
using Core.Interfaces;
using Core.Models;

namespace Application.Services
{
    public class InvestmentRequestService
    {
        private readonly IInvestmentRequestRepository _repo;
        private readonly IFileStorageService _storage;

        public InvestmentRequestService(
            IInvestmentRequestRepository repo,
            IFileStorageService storage)
        {
            _repo = repo;
            _storage = storage;
        }

        public async Task CreateAsync(
            CreateInvestmentRequestDto dto,
            string userId,
            Stream? investmentMemorandumStream,
            string? investmentMemorandumContentType,
            Stream? financialReportStream,
            string? financialReportContentType,
            Stream? businessPlanStream,
            string? businessPlanContentType,
            Stream? presentationStream,
            string? presentationContentType,
            List<(Stream Stream, string ContentType, string FileName)> otherDocuments)
        {
            var entity = InvestmentRequestMapper.ToModel(dto, userId);
            entity.CreatedAt = DateTime.UtcNow;

            await _repo.AddAsync(entity);

            var basePrefix = $"investment-requests/{entity.Id}";

            if (investmentMemorandumStream != null &&
                !string.IsNullOrEmpty(investmentMemorandumContentType))
            {
                using (investmentMemorandumStream)
                {
                    var key = $"{basePrefix}/memorandum";
                    await _storage.UploadAsync(investmentMemorandumStream, investmentMemorandumContentType, key);
                    entity.InvestmentMemorandumKey = key;
                }
            }

            if (financialReportStream != null &&
                !string.IsNullOrEmpty(financialReportContentType))
            {
                using (financialReportStream)
                {
                    var key = $"{basePrefix}/financial-report";
                    await _storage.UploadAsync(financialReportStream, financialReportContentType, key);
                    entity.FinancialReportKey = key;
                }
            }

            if (businessPlanStream != null &&
                !string.IsNullOrEmpty(businessPlanContentType))
            {
                using (businessPlanStream)
                {
                    var key = $"{basePrefix}/business-plan";
                    await _storage.UploadAsync(businessPlanStream, businessPlanContentType, key);
                    entity.BusinessPlanKey = key;
                }
            }

            if (presentationStream != null &&
                !string.IsNullOrEmpty(presentationContentType))
            {
                using (presentationStream)
                {
                    var key = $"{basePrefix}/presentation";
                    await _storage.UploadAsync(presentationStream, presentationContentType, key);
                    entity.PresentationKey = key;
                }
            }

            if (otherDocuments != null && otherDocuments.Count > 0)
            {
                entity.OtherDocumentsKeys ??= new List<string>();

                foreach (var doc in otherDocuments)
                {
                    using (doc.Stream)
                    {
                        var key = $"{basePrefix}/other/{Guid.NewGuid()}-{doc.FileName}";
                        await _storage.UploadAsync(doc.Stream, doc.ContentType, key);
                        entity.OtherDocumentsKeys.Add(key);
                    }
                }
            }

            await _repo.UpdateAsync(entity);
        }

        public async Task<List<InvestmentRequestResponseDto>> GetAllAsync(
            string? search,
            string? industry,
            string? profitRange,
            string? equityRange)
        {
            var items = await _repo.GetAllAsync(search, industry, profitRange, equityRange);
            return items.Select(InvestmentRequestMapper.ToResponseDto).ToList();
        }

        public async Task<InvestmentRequestResponseDto?> GetByIdAsync(string id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return null;

            return InvestmentRequestMapper.ToResponseDto(entity);
        }

        public async Task<bool> UpdateAsync(string id, UpdateInvestmentRequestDto dto, string userId)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return false;
            if (entity.UserId != userId) return false;

            InvestmentRequestMapper.UpdateModel(entity, dto);

            return await _repo.UpdateAsync(entity);
        }

        public async Task<bool> DeleteAsync(string id, string userId)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return false;
            if (entity.UserId != userId) return false;

            return await _repo.DeleteAsync(id);
        }

        public async Task<bool> PublishAsync(string id, string userId)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return false;
            if (entity.UserId != userId) return false;


            return true;
        }
    }
}
