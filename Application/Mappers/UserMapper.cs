using Core.Dtos;
using Core.Models;

namespace Application.Mappers;

public static class UserMapper
{
    public static UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
            // Password и PasswordHash НЕ возвращаем в DTO — это секрет!
        };
    }

    public static User ToModel(CreateUserDto dto)
    {
        return new User
        {
            Name = dto.Name,
            Email = dto.Email,
            // PasswordHash заполнится в AuthService, здесь НЕ трогаем
            Role = "User"
        };
    }
}