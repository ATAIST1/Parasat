namespace Core.Dtos;

public record SubscriptionStatusDto(
    bool IsActive,
    DateTime? ExpiresAt
);

public record CreateOrExtendSubscriptionDto(
    int Months   // на сколько месяцев продлить / купить
);
