using Core.Models;

namespace Core.Dtos.Admin;

public class AdminDealDto
{
    public string DealId { get; set; } = null!;
    public string ConversationId { get; set; } = null!;

    public int ContextType { get; set; }
    public string ContextId { get; set; } = null!;
    public string ContextTitle { get; set; } = null!;

    public UserShort Owner { get; set; } = null!;
    public UserShort Initiator { get; set; } = null!;

    public bool OwnerAccepted { get; set; }
    public bool InitiatorAccepted { get; set; }
    public DealStatus Status { get; set; }

    public DateTime CreatedAtUtc { get; set; }
    public DateTime? ActivatedAtUtc { get; set; }
    public DateTime? ClosedAtUtc { get; set; }
}
