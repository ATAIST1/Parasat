using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Core.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; } = null!;   // ← теперь хеш, а не пароль
        public string Role { get; set; } = "User";

        public List<string>? RefreshTokenHashes { get; set; } = new();

        public bool EmailConfirmed { get; set; } = false;
        public string? EmailConfirmationToken { get; set; }
        public DateTime? EmailConfirmationTokenExpires { get; set; }   

        // === НОВОЕ: 2FA ===
        /// <summary>Включён ли у пользователя 2FA.</summary>
        public bool IsTwoFactorEnabled { get; set; } = false;

        /// <summary>Хэш одноразового 2FA-кода.</summary>
        public string? TwoFactorCodeHash { get; set; }

        /// <summary>Время истечения одноразового кода.</summary>
        public DateTime? TwoFactorCodeExpiresAt { get; set; }

        /// <summary>Временный токен для связки "логин → ожидание кода".</summary>
        public string? TwoFactorTempToken { get; set; }

        // === НОВОЕ: восстановление пароля ===
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpires { get; set; }

        public DateTime? InvestorContactsSubscriptionExpiresAt { get; set; }

        public string? Phone { get; set; }
        public string? Telegram { get; set; }

        public bool IsBanned { get; set; } = false;
        public DateTime? BannedUntil { get; set; }
        
        public string? Location { get; set; }
        public string? About { get; set; }
    }
}