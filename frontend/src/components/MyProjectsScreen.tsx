import { useState, useEffect  } from 'react';
import { Bookmark, DollarSign, TrendingUp, Users, MessageCircle, ChevronLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { startupService } from '../services/startupService';
import { bookmarkService, BookmarkItemType } from '../services/bookmarkService';
import { toast } from 'sonner';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface MyProjectsScreenProps {
  navigateTo: (screen: string) => void;
}

export default function MyProjectsScreen({ navigateTo }: MyProjectsScreenProps) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleSave = async (id: string) => {
    if (savingId) return; // чтобы не спамить

    setSavingId(id);
    try {
      const isSaved = savedIds.has(id);

      if (isSaved) {
        await bookmarkService.remove(id, BookmarkItemType.Startup);
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast('Удалено из избранного');
      } else {
        await bookmarkService.add({ itemId: id, itemType: BookmarkItemType.Startup });
        setSavedIds(prev => new Set(prev).add(id));
        toast('Добавлено в избранное');
      }
    } catch (e) {
      console.error(e);
      toast('Ошибка избранного');
    } finally {
      setSavingId(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await startupService.getMine();
        const mapped = (data || []).map((s: any) => ({
          id: s.id || s.Id,
          name: s.projectName || s.ProjectName,
          stage: Array.isArray(s.stage) ? s.stage[0] : s.Stage?.[0],
          industry: s.industry || s.Industry,
          pitch: s.shortPitch || s.ShortPitch || '',
          mrr: String(s.revenue ?? s.Revenue ?? 0),
          users: String(s.dau ?? s.DAU ?? 0),
          team: String(s.teamMembers ?? s.TeamMembers ?? 0),
          tags: [...(s.model || s.Model || []), (s.currency || s.Currency || '')].filter(Boolean),
        }));
        setProjects(mapped);

        const bookmarks = await bookmarkService.getAll();
        const startupBookmarks = bookmarks
            .filter(b => b.itemType === BookmarkItemType.Startup)
            .map(b => b.itemId);
        setSavedIds(new Set(startupBookmarks));
      } catch (e) {
        console.error(e);
        toast('Не удалось загрузить мои проекты');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => navigateTo('back')} className="p-2 -ml-2">
          <ChevronLeft className="w-5 h-5" />
             </button>
         <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
         <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
         </div>
        <h1 className="text-gray-900">Мои проекты</h1>
    </div>
      <div className="p-4 space-y-4">
        {loading ? (
            <p className="text-center text-gray-500 py-16">Загрузка...</p>
        ) : projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">У вас пока нет проектов</p>
              <Button onClick={() => navigateTo('create-project')} className="mt-4">
                Создать проект
              </Button>
            </div>
        ) : (
            projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg text-gray-900">{project.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{project.stage}</Badge>
                    <Badge variant="outline">{project.industry}</Badge>
                    {project.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button
                    disabled={savingId === project.id}
                  onClick={() => toggleSave(project.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Bookmark
                    className={`w-5 h-5 ${savedIds.has(project.id) ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <p className="text-sm text-gray-600">{project.pitch}</p>

              <div className="flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>MRR {project.mrr} ₸</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{project.users} users</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{project.team} team</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  Редактировать
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  Заявки
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}