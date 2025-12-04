using Amazon;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySolution.Core.Interfaces;
using MySolution.Infrastructure.FileStorage;

namespace MySolution.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // AWS S3 client
        services.AddSingleton<IAmazonS3>(_ =>
        {
            var region = configuration["S3:Region"] ?? "eu-central-1";
            return new AmazonS3Client(RegionEndpoint.GetBySystemName(region));
        });

        // our file storage adapter
        services.AddSingleton<IFileStorage, S3FileStorage>();

        // other infra registrations...
        return services;
    }
}
