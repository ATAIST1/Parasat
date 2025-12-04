public interface IFileStorageService
{
    Task<string> UploadAsync(
        Stream stream,
        string contentType,
        string key,
        CancellationToken ct = default);

    Task<string> GetDownloadUrlAsync(
        string key,
        TimeSpan lifetime,
        CancellationToken ct = default);

    Task DeleteAsync(
        string key,
        CancellationToken ct = default);
}
