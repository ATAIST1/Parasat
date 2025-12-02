using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models;

public class BusinessFeed
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
    public string Industry { get; set; } = null!; // HoReCa, Логистика, Фитнес, Производство, Маркетинг
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



