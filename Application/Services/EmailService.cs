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

    public async Task SendTwoFactorCodeEmailAsync(string email, string code)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(
            _config["Email:FromName"] ?? "Parasat",
            _config["Email:From"] ?? throw new InvalidOperationException("Email:From is not configured")
        ));
        message.To.Add(new MailboxAddress(email, email));
        message.Subject = "Код входа в Parasat";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <h2>Вход в Parasat</h2>
                <p>Ваш одноразовый код для входа:</p>
                <p style='font-size:24px;font-weight:bold;'>{code}</p>
                <p>Код действителен 10 минут.</p>"
        };

        message.Body = bodyBuilder.ToMessageBody();

        var smtpServer = _config["Email:SmtpServer"];
        var port = int.Parse(_config["Email:Port"] ?? "587");
        var username = _config["Email:Username"];
        var password = _config["Email:Password"];

        using var client = new SmtpClient();
        await client.ConnectAsync(smtpServer, port, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(username, password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    public async Task SendPasswordResetEmailAsync(string email, string token)
    {
        var from = _config["Email:From"] ?? "no-reply@parasat.kz";
        var smtpServer = _config["Email:SmtpServer"] ?? "smtp.gmail.com";
        var port = int.Parse(_config["Email:Port"] ?? "587");
        var username = _config["Email:Username"];
        var password = _config["Email:Password"];

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Parasat", from));
        message.To.Add(new MailboxAddress(email, email));
        message.Subject = "Восстановление пароля Parasat";

        // Ссылка на фронт (подгони под свой фронт)
        var resetLink =
            $"http://localhost:3000/reset-password?token={token}&email={Uri.EscapeDataString(email)}";

        message.Body = new TextPart("html")
        {
            Text = $@"
                <h2>Восстановление пароля</h2>
                <p>Ты запросил(а) сброс пароля для аккаунта Parasat.</p>
                <p>Нажми на кнопку ниже, чтобы задать новый пароль:</p>
                <p>
                    <a href='{resetLink}'
                       style='padding:15px;background:#007bff;color:white;
                              text-decoration:none;border-radius:5px;'>
                        СБРОСИТЬ ПАРОЛЬ
                    </a>
                </p>
                <p>Или перейди по ссылке: {resetLink}</p>
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