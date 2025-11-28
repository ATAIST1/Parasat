using System.Collections.Generic;

namespace Core.Dtos;

public class InvestorDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Bio { get; set; } = null!;
    public string CheckSize { get; set; } = null!;
    public List<string> Industries { get; set; } = new();
    public string Deals { get; set; } = string.Empty;
    public string Exits { get; set; } = string.Empty;
    public bool Verified { get; set; }
}

public class CreateInvestorDto
{
    public string Name { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Bio { get; set; } = null!;
    public string CheckSize { get; set; } = null!;
    public List<string> Industries { get; set; } = new();
    public string Deals { get; set; } = string.Empty;
    public string Exits { get; set; } = string.Empty;
    public bool Verified { get; set; }
}

public class UpdateInvestorDto
{
    public string? Name { get; set; }
    public string? Title { get; set; }
    public string? Location { get; set; }
    public string? Bio { get; set; }
    public string? CheckSize { get; set; }
    public List<string>? Industries { get; set; }
    public string? Deals { get; set; }
    public string? Exits { get; set; }
    public bool? Verified { get; set; }
}

