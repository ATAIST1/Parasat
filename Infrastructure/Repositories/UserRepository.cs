using Core.Interfaces;      // ← это главное!
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
    }

    public async Task<User?> GetByEmailAsync(string email)
        => await _users.Find(x => x.Email == email).FirstOrDefaultAsync();

    public async Task<User?> GetByIdAsync(string id)
        => await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task AddAsync(User user)
        => await _users.InsertOneAsync(user);

    public async Task<List<User>> GetAllAsync()
        => await _users.Find(_ => true).ToListAsync();

    public async Task UpdateAsync(User user)
    {
        await _users.ReplaceOneAsync(x => x.Id == user.Id, user);
    }
    public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
    {
        return await _users.Find(x => x.RefreshTokens != null && x.RefreshTokens.Contains(refreshToken))
                        .FirstOrDefaultAsync();
    }
}