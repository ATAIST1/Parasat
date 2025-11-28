using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class MessageMapper
{
    public static MessageDto ToDto(this Message message, string currentUserId)
    {
        return new MessageDto
        {
            Id = message.Id,
            Text = message.Text,
            SentAt = message.SentAt,
            IsMine = message.FromId == currentUserId,  // моё сообщение или чужое
            IsRead = message.IsRead,
            From = new UserShortDto
            {
                Id = message.FromId,
                Name = "Загрузка..." // имя подтянется на фронте или отдельным запросом
            },
            To = new UserShortDto
            {
                Id = message.ToId,
                Name = "Загрузка..."
            }
        };
    }

    public static List<MessageDto> ToDtoList(this List<Message> messages, string currentUserId)
    {
        return messages.Select(m => m.ToDto(currentUserId)).ToList();
    }
}