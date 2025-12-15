namespace Core.Dtos.Conversations;

public class OpenChatDto
{
    public int ItemType { get; set; }    // 0..3
    public string ItemId { get; set; } = null!;
}
