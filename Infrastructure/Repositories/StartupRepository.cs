using Core.Interfaces;
using Core.Models;
using System.Linq;

namespace Infrastructure.Repositories
{
    public class StartupRepository : Core.Interfaces.IStartupRepository
    {
        private readonly List<Startup> _store = new();

        public Task<IEnumerable<Startup>> GetAllAsync()
        {
            return Task.FromResult(_store.AsEnumerable());
        }

        public Task<Startup?> GetByIdAsync(string id)
        {
            return Task.FromResult(_store.FirstOrDefault(x => x.Id == id));
        }

        public Task AddAsync(Startup startup)
        {
            _store.Add(startup);
            return Task.CompletedTask;
        }

        public Task<bool> UpdateAsync(Startup startup)
        {
            var index = _store.FindIndex(x => x.Id == startup.Id);
            if (index == -1) return Task.FromResult(false);

            _store[index] = startup;
            return Task.FromResult(true);
        }

        public Task<bool> DeleteAsync(string id)
        {
            var existing = _store.FirstOrDefault(x => x.Id == id);
            if (existing == null) return Task.FromResult(false);

            _store.Remove(existing);
            return Task.FromResult(true);
        }
    }
}
