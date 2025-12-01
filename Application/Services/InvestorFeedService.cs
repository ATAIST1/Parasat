using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class InvestorFeedService
{
    private readonly IInvestorFeedRepository _repository;

    public InvestorFeedService(IInvestorFeedRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<InvestorFeedDto>> GetAllAsync()
    {
        var investors = await _repository.GetAllAsync();
        return investors.Select(InvestorFeedMapper.ToDto).ToList();
    }

    public async Task<InvestorFeedDto?> GetByIdAsync(string id)
    {
        var investor = await _repository.GetByIdAsync(id);
        return investor != null ? InvestorFeedMapper.ToDto(investor) : null;
    }

    public async Task<InvestorFeedDto> CreateAsync(CreateInvestorFeedDto dto)
    {
        var investor = InvestorFeedMapper.ToModel(dto);
        await _repository.CreateAsync(investor);
        return InvestorFeedMapper.ToDto(investor);
    }

    public async Task<bool> UpdateAsync(string id, UpdateInvestorFeedDto dto)
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

    private static void ApplyUpdates(InvestorFeed investor, UpdateInvestorFeedDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Name))
            investor.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.Title))
            investor.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.Location))
            investor.Location = dto.Location;
        if (!string.IsNullOrWhiteSpace(dto.Bio))
            investor.Bio = dto.Bio;
        if (!string.IsNullOrWhiteSpace(dto.CheckSize))
            investor.CheckSize = dto.CheckSize;
        if (dto.Industries != null)
            investor.Industries = dto.Industries;
        if (dto.Deals != null)
            investor.Deals = dto.Deals;
        if (dto.Exits != null)
            investor.Exits = dto.Exits;
        if (dto.Verified.HasValue)
            investor.Verified = dto.Verified.Value;
    }
}


