using Core.Models;

namespace Core.Interfaces;

public interface IDealRepository
{
    Task<Deal?> GetByConversationIdAsync(string conversationId);
    Task CreateAsync(Deal deal);
    Task UpdateAsync(Deal deal);
}
