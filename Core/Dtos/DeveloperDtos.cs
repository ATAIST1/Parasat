using System.Collections.Generic;

namespace Core.Dtos;

public class DeveloperDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<string> Stack { get; set; } = new();
    public string Projects { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string Rate { get; set; } = null!;
    public bool Available { get; set; }
}

public class CreateDeveloperDto
{
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<string> Stack { get; set; } = new();
    public string Projects { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string Rate { get; set; } = null!;
    public bool Available { get; set; }
}

public class UpdateDeveloperDto
{
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
    public List<string>? Stack { get; set; }
    public string? Projects { get; set; }
    public string? Experience { get; set; }
    public string? Rate { get; set; }
    public bool? Available { get; set; }
}

