using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class BusinessFeedService
{
    private readonly IBusinessFeedRepository _repository;

    public BusinessFeedService(IBusinessFeedRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<BusinessFeedDto>> GetAllAsync()
    {
        var businesses = await _repository.GetAllAsync();
        return businesses.Select(BusinessFeedMapper.ToDto).ToList();
    }

    public async Task<BusinessFeedDto?> GetByIdAsync(string id)
    {
        var business = await _repository.GetByIdAsync(id);
        return business != null ? BusinessFeedMapper.ToDto(business) : null;
    }

    public async Task<BusinessFeedDto> CreateAsync(CreateBusinessFeedDto dto)
    {
        var business = BusinessFeedMapper.ToModel(dto);
        await _repository.CreateAsync(business);
        return BusinessFeedMapper.ToDto(business);
    }

    public async Task<bool> UpdateAsync(string id, UpdateBusinessFeedDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
        {
            return false;
        }

        ApplyUpdates(existing, dto);
        await _repository.UpdateAsync(existing);
        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
        {
            return false;
        }

        await _repository.DeleteAsync(id);
        return true;
    }

    private static void ApplyUpdates(BusinessFeed business, UpdateBusinessFeedDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Name))
            business.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.Industry))
            business.Industry = dto.Industry;
        if (!string.IsNullOrWhiteSpace(dto.Location))
            business.Location = dto.Location;
        if (!string.IsNullOrWhiteSpace(dto.Description))
            business.Description = dto.Description;
        if (dto.Revenue != null)
            business.Revenue = dto.Revenue;
        if (dto.Profit != null)
            business.Profit = dto.Profit;
        if (dto.Employees != null)
            business.Employees = dto.Employees;
        if (dto.Founded != null)
            business.Founded = dto.Founded;
        if (dto.InvestmentNeeded != null)
            business.InvestmentNeeded = dto.InvestmentNeeded;
        if (dto.InvestmentGoal != null)
            business.InvestmentGoal = dto.InvestmentGoal;
        if (dto.Equity != null)
            business.Equity = dto.Equity;
        if (dto.Verified.HasValue)
            business.Verified = dto.Verified.Value;
    }
}


