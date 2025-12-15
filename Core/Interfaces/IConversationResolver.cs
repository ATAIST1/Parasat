using Core.Models;

namespace Core.Interfaces;

public interface IConversationContextOwnerResolver
{
    Task<string> GetOwnerIdAsync(ConversationContextType type, string itemId);
}
