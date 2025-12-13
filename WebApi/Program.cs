using Microsoft.OpenApi.Models;
using Core.Interfaces;
using Infrastructure.Repositories;
using Application.Services;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure; // for AddInfrastructure
using WebApi.Hubs;

var builder = WebApplication.CreateBuilder(args);

// === MongoDB — всё из secrets ===
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();

    var connectionString = configuration["MongoDb:ConnectionString"]
                        ?? configuration.GetConnectionString("MongoDb");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException(
            "MongoDB connection string is missing! " +
            "Run: dotnet user-secrets set \"MongoDb:ConnectionString\" \"mongodb+srv://...\"");
    }

    return new MongoClient(connectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    var dbName = builder.Configuration["MongoDb:DatabaseName"] ?? "ParasatDb";
    return client.GetDatabase(dbName);
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

// === DI для репозиториев и сервисов ===
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBookmarkRepository, BookmarkRepository>();
builder.Services.AddScoped<INewsRepository, NewsRepository>();
builder.Services.AddScoped<IChatRepository, ChatRepository>();

// Infrastructure (S3, etc.)
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddSignalR();
builder.Services.AddScoped<NewsService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<BookmarkService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<MessageService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<Core.Interfaces.IStartupRepository, Infrastructure.Repositories.StartupRepository>();
builder.Services.AddScoped<StartupService>();
builder.Services.AddScoped<IDeveloperProfileRepository, DeveloperProfileRepository>();
builder.Services.AddScoped<DeveloperProfileService>();
builder.Services.AddScoped<IInvestmentRequestRepository, InvestmentRequestRepository>();
builder.Services.AddScoped<InvestmentRequestService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IInvestorProfileRepository, InvestorProfileRepository>();
builder.Services.AddScoped<InvestorProfileService>();
builder.Services.AddScoped<InvestorContactsService>();
builder.Services.AddScoped<SubscriptionService>();
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();

// === JWT Authentication ===
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]
                    ?? throw new InvalidOperationException("Jwt:Key is missing in configuration")))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Parasat API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ВАЖНО: порядок именно такой!
app.UseAuthentication();
app.UseAuthorization();

app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
