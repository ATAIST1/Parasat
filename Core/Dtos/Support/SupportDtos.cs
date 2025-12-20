namespace Core.Dtos.Support
{
    public class CreateSupportTicketDto
    {
        public string Subject { get; set; } = null!;
        public string Category { get; set; } = "General";
        public string Priority { get; set; } = "Normal";
        public string? InitialMessage { get; set; }
    }

    public class SupportMessageDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Content { get; set; } = null!;
        public bool IsSupportAgent { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> AttachmentKeys { get; set; } = new();
    }

    public class SupportTicketDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public string Status { get; set; } = null!;
        public List<SupportMessageDto> Messages { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? AssignedToAgentId { get; set; }
    }

    public class UpdateTicketStatusDto
    {
        public string Status { get; set; } = null!;
    }

    public class SendSupportMessageDto
    {
        public string Content { get; set; } = null!;
        public List<string>? AttachmentKeys { get; set; }
    }
}
