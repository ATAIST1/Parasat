namespace Core.Dtos;

public class ConversationListItemDto
{
    public string Id { get; set; } = null!;
    public string StartupId { get; set; } = null!;
    public string PartnerId { get; set; } = null!;
    public string PartnerName { get; set; } = null!;
    public string? LastText { get; set; }
    public DateTime? LastSentAt { get; set; }
}
