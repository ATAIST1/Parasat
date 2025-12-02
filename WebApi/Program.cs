using Microsoft.OpenApi.Models;
using Core.Interfaces;
using Infrastructure.Repositories;
using Application.Services;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

// УДАЛИ ЭТУ СТРОКУ — она дублирует и хардкодит имя базы! 
// builder.Services.AddScoped(sp => { ... "ParasatDb" });

// === DI для репозиториев и сервисов ===
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IStartupFeedRepository, StartupFeedRepository>();
builder.Services.AddScoped<IInvestorFeedRepository, InvestorFeedRepository>();
builder.Services.AddScoped<IDeveloperFeedRepository, DeveloperFeedRepository>();
builder.Services.AddScoped<IBusinessFeedRepository, BusinessFeedRepository>();
builder.Services.AddScoped<IBookmarkRepository, BookmarkRepository>();

builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<BookmarkService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ChatService>();
builder.Services.AddScoped<AuthService>(); // ← ДОБАВЬ ЭТУ СТРОЧКУ! Без неё AuthController не запустится!
builder.Services.AddScoped<Core.Interfaces.IStartupRepository, Infrastructure.Repositories.StartupRepository>();
builder.Services.AddScoped<StartupService>();
builder.Services.AddScoped<IDeveloperProfileRepository, DeveloperProfileRepository>();
builder.Services.AddScoped<DeveloperProfileService>();
builder.Services.AddScoped<IInvestmentRequestRepository, InvestmentRequestRepository>();
builder.Services.AddScoped<InvestmentRequestService>();
builder.Services.AddHttpContextAccessor();

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

app.MapControllers();

app.Run();