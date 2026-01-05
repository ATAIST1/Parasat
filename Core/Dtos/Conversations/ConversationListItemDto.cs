using Core.Models;
namespace Core.Dtos.Conversations;

public class ConversationListItemDto
{
    public string ConversationId { get; set; } = null!;
    public int ItemType { get; set; }
    public string ItemId { get; set; } = null!;
    public string OwnerId { get; set; } = null!;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
    public int UnreadCount { get; set; }

    public string Title { get; set; } = null!;       // что показываем жирным
    public string? Subtitle { get; set; }            // второй ряд
    public string? AvatarText { get; set; }   
}
