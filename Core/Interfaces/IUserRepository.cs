using Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces;

public interface IUserRepository
{
    Task AddAsync(User user);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(string id);
    Task<List<User>> GetAllAsync();
    Task UpdateAsync(User user);
    Task<User?> GetByRefreshTokenAsync(string refreshToken);
}