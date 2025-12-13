using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class MessageMapper
{
    public static MessageDto ToDto(this Message message, string currentUserId, IReadOnlyDictionary<string, string> names)
    {
        string GetName(string id) => names.TryGetValue(id, out var n) ? n : "Unknown";

        return new MessageDto
        {
            Id = message.Id,
            Text = message.Text,
            SentAt = message.SentAt,
            IsMine = message.FromId == currentUserId,
            IsRead = message.IsRead,
            From = new UserShortDto { Id = message.FromId, Name = GetName(message.FromId) },
            To   = new UserShortDto { Id = message.ToId,   Name = GetName(message.ToId)   },
        };
    }

    public static List<MessageDto> ToDtoList(this List<Message> messages, string currentUserId, IReadOnlyDictionary<string, string> names)
        => messages.Select(m => m.ToDto(currentUserId, names)).ToList();
}
