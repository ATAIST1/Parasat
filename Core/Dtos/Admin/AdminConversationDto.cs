namespace Core.Dtos.Admin;

public class AdminConversationDto
{
    public string ConversationId { get; set; } = null!;
    public int ContextType { get; set; }
    public string ContextId { get; set; } = null!;
    public string ContextTitle { get; set; } = null!;

    public UserShort Owner { get; set; } = null!;
    public UserShort Initiator { get; set; } = null!;

    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}

public class UserShort
{
    public string Id { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
}
