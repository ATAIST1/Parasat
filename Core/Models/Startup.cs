namespace Core.Models;

public class Startup
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string OwnerId { get; set; }

    public string ProjectName { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Industry { get; set; }
    public string SubIndustry { get; set; }
    public List<string> Technologies { get; set; }
    public string City { get; set; }
    public string Country { get; set; }


    public string Currency { get; set; }
    public long? InvestmentRequested { get; set; }
    public List<string> SpendPlan { get; set; }



    public long? Revenue { get; set; }
    public int? DAU { get; set; }
    public int? MAU { get; set; }
    public int? GrowthPercentage { get; set; }


    public string PitchDeckUrl { get; set; }
    public string FinancialModelUrl { get; set; }
    public List<string> ExternalLinks { get; set; } = new();


    public string Status { get; set; } = "draft";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
