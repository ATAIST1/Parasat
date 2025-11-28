using System.Collections.Generic;

namespace Core.Dtos;

public class StartupDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Stage { get; set; } = null!;
    public string Industry { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Pitch { get; set; } = null!;
    public string Mrr { get; set; } = string.Empty;
    public string Users { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
}

public class CreateStartupDto
{
    public string Name { get; set; } = null!;
    public string Stage { get; set; } = null!;
    public string Industry { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Pitch { get; set; } = null!;
    public string Mrr { get; set; } = string.Empty;
    public string Users { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
}

public class UpdateStartupDto
{
    public string? Name { get; set; }
    public string? Stage { get; set; }
    public string? Industry { get; set; }
    public string? Location { get; set; }
    public string? Pitch { get; set; }
    public string? Mrr { get; set; }
    public string? Users { get; set; }
    public string? Team { get; set; }
    public List<string>? Tags { get; set; }
}

