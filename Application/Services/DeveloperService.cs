using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class DeveloperService
{
    private readonly IDeveloperRepository _repository;

    public DeveloperService(IDeveloperRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<DeveloperDto>> GetAllAsync()
    {
        var developers = await _repository.GetAllAsync();
        return developers.Select(DeveloperMapper.ToDto).ToList();
    }

    public async Task<DeveloperDto?> GetByIdAsync(string id)
    {
        var developer = await _repository.GetByIdAsync(id);
        return developer != null ? DeveloperMapper.ToDto(developer) : null;
    }

    public async Task<DeveloperDto> CreateAsync(CreateDeveloperDto dto)
    {
        var developer = DeveloperMapper.ToModel(dto);
        await _repository.CreateAsync(developer);
        return DeveloperMapper.ToDto(developer);
    }

    public async Task<bool> UpdateAsync(string id, UpdateDeveloperDto dto)
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

    private static void ApplyUpdates(Developer developer, UpdateDeveloperDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Name))
            developer.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.Type))
            developer.Type = dto.Type;
        if (!string.IsNullOrWhiteSpace(dto.Location))
            developer.Location = dto.Location;
        if (!string.IsNullOrWhiteSpace(dto.Description))
            developer.Description = dto.Description;
        if (dto.Stack != null)
            developer.Stack = dto.Stack;
        if (dto.Projects != null)
            developer.Projects = dto.Projects;
        if (dto.Experience != null)
            developer.Experience = dto.Experience;
        if (dto.Rate != null)
            developer.Rate = dto.Rate;
        if (dto.Available.HasValue)
            developer.Available = dto.Available.Value;
    }
}

