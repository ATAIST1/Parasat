using Application.Mappers;
using Core.Dtos.Investment;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class InvestmentRequestService
{
    private readonly IInvestmentRequestRepository _repo;
    private readonly IFileStorageService _storage;

    public InvestmentRequestService(IInvestmentRequestRepository repo, IFileStorageService storage)
    {
        _repo = repo;
        _storage = storage;
    }

    // Публичная лента: только Published
    public async Task<List<InvestmentRequestResponseDto>> GetAllPublishedAsync(
        string? search, string? industry, string? profitRange, string? equityRange)
    {
        var items = await _repo.GetAllAsync(search, industry, profitRange, equityRange, InvestmentRequestStatus.Published);
        return items.Select(InvestmentRequestMapper.ToResponseDto).ToList();
    }

    // Мои: любые статусы, но только мои
    public async Task<List<InvestmentRequestResponseDto>> GetMyAsync(string userId)
    {
        var all = await _repo.GetAllAsync();
        var mine = all.Where(x => x.UserId == userId)
                      .OrderByDescending(x => x.CreatedAt)
                      .ToList();

        return mine.Select(InvestmentRequestMapper.ToResponseDto).ToList();
    }

    // Деталка: Published видят все, Draft видит только владелец
    public async Task<InvestmentRequestResponseDto?> GetByIdAsync(string id, string? userIdOrNull)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return null;

        if (entity.Status != InvestmentRequestStatus.Published && entity.UserId != userIdOrNull)
            return null;

        return InvestmentRequestMapper.ToResponseDto(entity);
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
        entity.Status = InvestmentRequestStatus.Draft;

        await _repo.AddAsync(entity);

        var basePrefix = $"investment-requests/{entity.Id}";

        if (investmentMemorandumStream != null && !string.IsNullOrEmpty(investmentMemorandumContentType))
        {
            using (investmentMemorandumStream)
            {
                var key = $"{basePrefix}/memorandum";
                await _storage.UploadAsync(investmentMemorandumStream, investmentMemorandumContentType, key);
                entity.InvestmentMemorandumKey = key;
            }
        }

        if (financialReportStream != null && !string.IsNullOrEmpty(financialReportContentType))
        {
            using (financialReportStream)
            {
                var key = $"{basePrefix}/financial-report";
                await _storage.UploadAsync(financialReportStream, financialReportContentType, key);
                entity.FinancialReportKey = key;
            }
        }

        if (businessPlanStream != null && !string.IsNullOrEmpty(businessPlanContentType))
        {
            using (businessPlanStream)
            {
                var key = $"{basePrefix}/business-plan";
                await _storage.UploadAsync(businessPlanStream, businessPlanContentType, key);
                entity.BusinessPlanKey = key;
            }
        }

        if (presentationStream != null && !string.IsNullOrEmpty(presentationContentType))
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

    public async Task<bool> UpdateAsync(string id, UpdateInvestmentRequestDto dto, string userId)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return false;
        if (entity.UserId != userId) return false;

        // published лучше не давать редактировать как draft (если хочешь — скажи)
        if (entity.Status != InvestmentRequestStatus.Draft)
            throw new InvalidOperationException("Only Draft can be edited");

        InvestmentRequestMapper.UpdateModel(entity, dto);
        return await _repo.UpdateAsync(entity);
    }

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return false;
        if (entity.UserId != userId) return false;

        // по уму: удалить файлы в S3 по ключам (если надо — сделаю следом)
        return await _repo.DeleteAsync(id);
    }

    public async Task<bool> PublishAsync(string id, string userId)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return false;
        if (entity.UserId != userId) return false;

        if (entity.Status != InvestmentRequestStatus.Draft)
            return false;

        entity.Status = InvestmentRequestStatus.Published;
        entity.PublishedAt = DateTime.UtcNow;

        return await _repo.UpdateAsync(entity);
    }
}
