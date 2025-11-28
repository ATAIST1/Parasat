using Application.Mappers;
using Core.Dtos;
using Core.Interfaces;
using Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(UserMapper.ToDto).ToList();
        }

        public async Task<UserDto?> GetUserByIdAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user != null ? UserMapper.ToDto(user) : null;
        }

        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            return user != null ? UserMapper.ToDto(user) : null;
        }

        public async Task CreateUserAsync(CreateUserDto dto)
        {
            var user = UserMapper.ToModel(dto);
            await _userRepository.AddAsync(user);
        }

        // УДАЛИ ЭТОТ МЕТОД ИЗ СЕРВИСА — он не должен быть здесь!
        // public async Task<User?> GetByRefreshTokenAsync(...) — НЕТ!
    }
}