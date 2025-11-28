namespace Core.Dtos;

public class MessageDto
{
    public string Id { get; set; } = null!;
    public string Text { get; set; } = null!;
    public DateTime SentAt { get; set; }
    public bool IsMine { get; set; }        // чтобы на фронте красиво выравнивать
    public bool IsRead { get; set; }
    public UserShortDto From { get; set; } = null!;
    public UserShortDto To { get; set; } = null!;
}

public class UserShortDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
}