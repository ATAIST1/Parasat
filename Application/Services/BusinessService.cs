using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class BusinessService
{
    private readonly IBusinessRepository _repository;

    public BusinessService(IBusinessRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<BusinessDto>> GetAllAsync()
    {
        var businesses = await _repository.GetAllAsync();
        return businesses.Select(BusinessMapper.ToDto).ToList();
    }

    public async Task<BusinessDto?> GetByIdAsync(string id)
    {
        var business = await _repository.GetByIdAsync(id);
        return business != null ? BusinessMapper.ToDto(business) : null;
    }

    public async Task<BusinessDto> CreateAsync(CreateBusinessDto dto)
    {
        var business = BusinessMapper.ToModel(dto);
        await _repository.CreateAsync(business);
        return BusinessMapper.ToDto(business);
    }

    public async Task<bool> UpdateAsync(string id, UpdateBusinessDto dto)
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

    private static void ApplyUpdates(Business business, UpdateBusinessDto dto)
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

