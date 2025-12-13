using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class AdminService
{
    private readonly IUserRepository _userRepo;

    public AdminService(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _userRepo.GetAllAsync();
    }

    public async Task ChangeRoleAsync(string userId, string role)
    {
        var user = await _userRepo.GetByIdAsync(userId)
                   ?? throw new Exception("User not found");

        user.Role = role;
        await _userRepo.UpdateAsync(user);
    }

    public async Task ToggleTwoFactorAsync(string userId, bool enabled)
    {
        var user = await _userRepo.GetByIdAsync(userId)
                   ?? throw new Exception("User not found");

        user.IsTwoFactorEnabled = enabled;
        if (!enabled)
        {
            user.TwoFactorCodeHash = null;
            user.TwoFactorCodeExpiresAt = null;
            user.TwoFactorTempToken = null;
        }

        await _userRepo.UpdateAsync(user);
    }

    public async Task BanUserAsync(string userId)
        {
            var user = await _userRepo.GetByIdAsync(userId) ?? throw new Exception("User not found");
            user.IsBanned = true;
            user.BannedUntil = null; // или DateTime.UtcNow.AddDays(7)
            await _userRepo.UpdateAsync(user);
        }

}
