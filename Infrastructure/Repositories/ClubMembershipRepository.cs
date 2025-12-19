using Core.Interfaces;
using Core.Models;
using MongoDB.Driver;

namespace Infrastructure.Repositories
{
    public class ClubMembershipRepository : IClubMembershipRepository
    {
        private readonly IMongoCollection<ClubMembershipApplication> _collection;

        public ClubMembershipRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<ClubMembershipApplication>("club_membership_applications");

            // индекс по UserId (не обязателен, но полезен)
            var idx = new CreateIndexModel<ClubMembershipApplication>(
                Builders<ClubMembershipApplication>.IndexKeys.Ascending(x => x.UserId)
            );
            _collection.Indexes.CreateOne(idx);
        }

        public async Task<List<ClubMembershipApplication>> GetAllAsync()
            => await _collection.Find(_ => true)
                .SortByDescending(x => x.CreatedAtUtc)
                .ToListAsync();

        public async Task<ClubMembershipApplication?> GetByIdAsync(string id)
            => await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<ClubMembershipApplication?> GetLatestByUserIdAsync(string userId)
            => await _collection.Find(x => x.UserId == userId)
                .SortByDescending(x => x.CreatedAtUtc)
                .FirstOrDefaultAsync();

        public async Task<ClubMembershipApplication?> GetActiveOrPendingByUserIdAsync(string userId)
            => await _collection.Find(x =>
                    x.UserId == userId &&
                    (x.Status == ClubMembershipStatus.Pending || x.Status == ClubMembershipStatus.Approved)
                )
                .SortByDescending(x => x.CreatedAtUtc)
                .FirstOrDefaultAsync();

        public async Task AddAsync(ClubMembershipApplication application)
            => await _collection.InsertOneAsync(application);

        public async Task<bool> UpdateAsync(ClubMembershipApplication application)
        {
            var result = await _collection.ReplaceOneAsync(x => x.Id == application.Id, application);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<ClubMembershipApplication?> GetActiveOrPendingByContactAsync(string email, string phone)
    => await _collection.Find(x =>
            x.Email == email &&
            x.Phone == phone &&
            (x.Status == ClubMembershipStatus.Pending || x.Status == ClubMembershipStatus.Approved)
        )
        .SortByDescending(x => x.CreatedAtUtc)
        .FirstOrDefaultAsync();

    }
}
