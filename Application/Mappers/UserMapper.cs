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
            Role = user.Role,
            Phone = user.Phone,
            Location = user.Location,
            About = user.About,
            IsVerified = user.VerificationStatus == VerificationStatus.Verified,
        };
    }

    public static User ToModel(CreateUserDto dto)
    {
        return new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Role = "User"
        };
    }
}