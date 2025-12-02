using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class StartupFeedService
{
    private readonly IStartupFeedRepository _repository;

    public StartupFeedService(IStartupFeedRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<StartupFeedDto>> GetAllAsync(
        string? search = null,
        string? stage = null,
        string? industry = null,
        string? location = null)
    {
        var startups = await _repository.GetAllAsync(search, stage, industry, location);
        return startups.Select(StartupFeedMapper.ToDto).ToList();
    }

    public async Task<List<StartupFeedDto>> GetAllAsync()
    {
        var startups = await _repository.GetAllAsync();
        return startups.Select(StartupFeedMapper.ToDto).ToList();
    }

    public async Task<StartupFeedDto?> GetByIdAsync(string id)
    {
        var startup = await _repository.GetByIdAsync(id);
        return startup != null ? StartupFeedMapper.ToDto(startup) : null;
    }

    public async Task<StartupFeedDto> CreateAsync(CreateStartupFeedDto dto)
    {
        var startup = StartupFeedMapper.ToModel(dto);
        await _repository.CreateAsync(startup);
        return StartupFeedMapper.ToDto(startup);
    }

    public async Task<bool> UpdateAsync(string id, UpdateStartupFeedDto dto)
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

    private static void ApplyUpdates(StartupFeed startup, UpdateStartupFeedDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Name))
            startup.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.Stage))
            startup.Stage = dto.Stage;
        if (!string.IsNullOrWhiteSpace(dto.Industry))
            startup.Industry = dto.Industry;
        if (!string.IsNullOrWhiteSpace(dto.Location))
            startup.Location = dto.Location;
        if (!string.IsNullOrWhiteSpace(dto.Pitch))
            startup.Pitch = dto.Pitch;
        if (dto.Mrr != null)
            startup.Mrr = dto.Mrr;
        if (dto.Users != null)
            startup.Users = dto.Users;
        if (dto.Team != null)
            startup.Team = dto.Team;
        if (dto.Tags != null)
            startup.Tags = dto.Tags;
    }
}


