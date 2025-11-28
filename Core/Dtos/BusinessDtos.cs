namespace Core.Dtos;

public class BusinessDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Industry { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Revenue { get; set; } = null!;
    public string Profit { get; set; } = null!;
    public string Employees { get; set; } = null!;
    public string Founded { get; set; } = null!;
    public string InvestmentNeeded { get; set; } = null!;
    public string InvestmentGoal { get; set; } = null!;
    public string Equity { get; set; } = null!;
    public bool Verified { get; set; }
}

public class CreateBusinessDto
{
    public string Name { get; set; } = null!;
    public string Industry { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Revenue { get; set; } = null!;
    public string Profit { get; set; } = null!;
    public string Employees { get; set; } = null!;
    public string Founded { get; set; } = null!;
    public string InvestmentNeeded { get; set; } = null!;
    public string InvestmentGoal { get; set; } = null!;
    public string Equity { get; set; } = null!;
    public bool Verified { get; set; }
}

public class UpdateBusinessDto
{
    public string? Name { get; set; }
    public string? Industry { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
    public string? Revenue { get; set; }
    public string? Profit { get; set; }
    public string? Employees { get; set; }
    public string? Founded { get; set; }
    public string? InvestmentNeeded { get; set; }
    public string? InvestmentGoal { get; set; }
    public string? Equity { get; set; }
    public bool? Verified { get; set; }
}

