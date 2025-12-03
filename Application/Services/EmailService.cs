using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace Application.Services;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendConfirmationEmailAsync(string email, string token)
    {
        var from = _config["Email:From"] ?? "no-reply@parasat.kz";
        var smtpServer = _config["Email:SmtpServer"] ?? "smtp.gmail.com";
        var port = int.Parse(_config["Email:Port"] ?? "587");
        var username = _config["Email:Username"];
        var password = _config["Email:Password"];

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(from));
        message.To.Add(MailboxAddress.Parse(email));
        message.Subject = "Parasat — Подтвердите email";

        var confirmLink = $"http://localhost:5073/api/auth/confirm-email?token={token}&email={Uri.EscapeDataString(email)}";
        
        message.Body = new TextPart("html")
        {
            Text = $@"
                <h2>Привет!</h2>
                <p>Подтверди свой email, чтобы войти в Parasat:</p>
                <p><a href='{confirmLink}' style='padding:15px;background:#007bff;color:white;text-decoration:none;border-radius:5px;'>ПОДТВЕРДИТЬ EMAIL</a></p>
                <p>Или перейди по ссылке: {confirmLink}</p>
                <p>Ссылка действительна 1 час.</p>
            "
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(smtpServer, port, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(username, password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}