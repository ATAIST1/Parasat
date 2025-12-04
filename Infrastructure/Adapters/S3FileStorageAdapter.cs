using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using MySolution.Core.Interfaces;

namespace MySolution.Infrastructure.FileStorage;

public class S3FileStorageAdapter : IFileStorage
{
    private readonly IAmazonS3 _s3;
    private readonly string _bucketName;

    public S3FileStorage(IAmazonS3 s3, IConfiguration config)
    {
        _s3 = s3;
        _bucketName = config["S3:BucketName"]
            ?? throw new InvalidOperationException("S3:BucketName is not configured");
    }

    public async Task<string> UploadAsync(
        Stream stream,
        string contentType,
        string key,
        CancellationToken ct = default)
    {
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
            InputStream = stream,
            ContentType = contentType
        };

        await _s3.PutObjectAsync(request, ct);

        return key; // Application will store this key in DB
    }

    public Task<string> GetDownloadUrlAsync(
        string key,
        TimeSpan lifetime,
        CancellationToken ct = default)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Expires = DateTime.UtcNow.Add(lifetime)
        };

        var url = _s3.GetPreSignedURL(request);
        return Task.FromResult(url);
    }

    public async Task DeleteAsync(
        string key,
        CancellationToken ct = default)
    {
        await _s3.DeleteObjectAsync(_bucketName, key, ct);
    }
}
