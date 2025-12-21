import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { adminService, AdminUserDto, AdminNewsDto , AdminDealDto } from '../services/adminService';
import NewsDetailScreen from './NewsDetailScreen';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [banConfirm, setBanConfirm] = useState<AdminUserDto | null>(null);
    const [makeAdminConfirm, setMakeAdminConfirm] = useState<AdminUserDto | null>(null);
    const [unbanConfirm, setUnbanConfirm] = useState<AdminUserDto | null>(null);
    const [view, setView] = useState<'users' | 'deals' | 'news'>('users');
    // const [conversations, setConversations] = useState<AdminConversationDto[]>([]);
    const [news, setNews] = useState<AdminNewsDto[]>([]);
    const [newsLoading, setNewsLoading] = useState(false);

    const [newsCreateOpen, setNewsCreateOpen] = useState(false);
    const [newsEdit, setNewsEdit] = useState<AdminNewsDto | null>(null);
    const [newsDeleteConfirm, setNewsDeleteConfirm] = useState<AdminNewsDto | null>(null);
    const [newsPreviewId, setNewsPreviewId] = useState<string | null>(null);

    const [deals, setDeals] = useState<AdminDealDto[]>([]);


    const [newsForm, setNewsForm] = useState({
        title: '',
        description: '',
        content: '',
        category: '',
        badge: '',
        isFeatured: false,
        date: '', // ISO строка
        image: null as File | null,
    });

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setUsers(await adminService.getUsers());
        } finally {
            setIsLoading(false);
        }
    };

    const loadNews = async () => {
        try {
            setNewsLoading(true);
            setNews(await adminService.getNews());
        } finally {
            setNewsLoading(false);
        }
    };

    // const loadConversations = async () => {
    //     try {
    //         setIsLoading(true);
    //         setConversations(await adminService.getConversations());
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const loadDeals = async () => {
        try {
            setIsLoading(true);
            setDeals(await adminService.getDeals());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'users') loadUsers();
        if (view === 'deals') loadDeals();
        if (view === 'news') loadNews();
    }, [view]);
    const makeAdmin = async (id: string) => {
        await adminService.makeAdmin(id);
        loadUsers();
    };

    const banUser = async (id: string) => {
        await adminService.ban(id);
        loadUsers();
    };

    const unbanUser = async (id: string) => {
        await adminService.unban(id);
        loadUsers();
    };

    const stats = useMemo(() => {
        const total = users.length;
        const banned = users.filter(u => u.isBanned).length;
        const admins = users.filter(u => (u.role || '').toLowerCase() === 'admin').length;
        return { total, banned, admins };
    }, [users]);

    const newsValidation = {
        title:
            newsForm.title.trim().length >= 5 &&
            newsForm.title.trim().length <= 200,

        description: newsForm.description.trim().length > 0,

        content: newsForm.content.trim().length >= 20,

        category: newsForm.category.trim().length > 0,

        badge: newsForm.badge.trim().length > 0,
    };

    const isNewsFormValid = Object.values(newsValidation).every(Boolean);
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={onBack}>
                            ← Назад
                        </Button>
                        <div>
                            <h1 className="text-gray-900 text-lg font-semibold">Админ-панель</h1>
                            <p className="text-sm text-gray-500">
                                {view === 'users' ? 'Управление пользователями'
                                    : view === 'deals' ? 'Все сделки'
                                        : 'Новости'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Пользователей: {stats.total}</Badge>
                        <Badge variant="outline">Админов: {stats.admins}</Badge>
                        <Badge variant="outline">Забанено: {stats.banned}</Badge>

                        <div className="flex items-center gap-2 ml-2">
                            <Button
                                variant={view === 'users' ? 'default' : 'outline'}
                                onClick={() => {
                                    setView('users');
                                    loadUsers();
                                }}
                                size="sm"
                            >
                                Пользователи
                            </Button>

                            <Button
                                variant={view === 'deals' ? 'default' : 'outline'}
                                onClick={() => {
                                    setView('deals');
                                }}
                                size="sm"
                            >
                                Сделки
                            </Button>

                            <Button
                                variant={view === 'news' ? 'default' : 'outline'}
                                onClick={() => {
                                    setView('news');
                                    loadNews();
                                }}
                                size="sm"
                            >
                                Новости
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            onClick={view === 'users'
                                ? loadUsers
                                : view === 'deals'
                                    ? loadDeals
                                    : loadNews}
                            disabled={isLoading || newsLoading}
                        >
                            {isLoading ? '...' : 'Обновить'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {view === 'users' && (
                    <div className="space-y-4">
                        {users.length === 0 && !isLoading && (
                            <div className="text-center py-12 text-gray-500">Пользователей нет</div>
                        )}

                        {users.map(u => {
                            const isAdmin = (u.role || '').toLowerCase() === 'admin';

                            return (
                                <div
                                    key={u.id}
                                    className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 space-y-2 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-gray-900 font-semibold truncate">
                                                    {u.name?.trim() ? u.name : '—'}
                                                </h3>

                                                <Badge variant={isAdmin ? 'secondary' : 'outline'}>
                                                    {u.role || '—'}
                                                </Badge>

                                                {u.isBanned ? (
                                                    <Badge variant="destructive">Забанен</Badge>
                                                ) : (
                                                    <Badge variant="outline">Активен</Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-600 truncate">{u.email}</p>
                                        </div>
                                    </div>

                                    {/* actions */}
                                    <div className="flex gap-2">
                                        {!isAdmin && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={u.isBanned}
                                                className="flex-1"
                                                onClick={() => setMakeAdminConfirm(u)}
                                            >
                                                Сделать админом
                                            </Button>
                                        )}

                                        {!u.isBanned ? (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="flex-1"
                                                onClick={() => setBanConfirm(u)}
                                            >
                                                Забанить
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => setUnbanConfirm(u)}
                                            >
                                                Разбанить
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {/*{view === 'conversations' && (*/}
                {/*    <div className="space-y-4">*/}
                {/*        {conversations.length === 0 && !isLoading && (*/}
                {/*            <div className="text-center py-12 text-gray-500">Конверсейшенов нет</div>*/}
                {/*        )}*/}

                {/*        {conversations.map(c => (*/}
                {/*            <div*/}
                {/*                key={c.conversationId}*/}
                {/*                className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"*/}
                {/*            >*/}
                {/*                /!* header *!/*/}
                {/*                <div className="flex items-start justify-between gap-3">*/}
                {/*                    <div className="flex-1 min-w-0 space-y-1">*/}
                {/*                        <h3 className="text-gray-900 font-semibold truncate">*/}
                {/*                            {c.contextTitle}*/}
                {/*                        </h3>*/}
                {/*                        <p className="text-xs text-gray-400 truncate">{c.contextId}</p>*/}
                {/*                    </div>*/}

                {/*                    <div className="text-xs text-gray-500">*/}
                {/*                        {new Date(c.updatedAtUtc).toLocaleDateString()}*/}
                {/*                    </div>*/}
                {/*                </div>*/}

                {/*                /!* between who *!/*/}
                {/*                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">*/}
                {/*                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">*/}
                {/*                        <p className="text-xs text-gray-500 mb-1">Owner</p>*/}
                {/*                        <p className="text-sm text-gray-900 font-medium truncate">{c.owner.name}</p>*/}
                {/*                        <p className="text-xs text-gray-500 truncate">{c.owner.email}</p>*/}
                {/*                    </div>*/}

                {/*                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">*/}
                {/*                        <p className="text-xs text-gray-500 mb-1">Initiator</p>*/}
                {/*                        <p className="text-sm text-gray-900 font-medium truncate">{c.initiator.name}</p>*/}
                {/*                        <p className="text-xs text-gray-500 truncate">{c.initiator.email}</p>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*)}*/}
                {view === 'news' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Всего новостей: <span className="font-medium text-gray-900">{news.length}</span>
                            </div>
                            <Button onClick={() => {
                                setNewsForm({
                                    title: '',
                                    description: '',
                                    content: '',
                                    category: '',
                                    badge: '',
                                    isFeatured: false,
                                    date: '',
                                    image: null,
                                });
                                setNewsCreateOpen(true);
                            }}>
                                + Добавить новость
                            </Button>
                        </div>

                        {news.length === 0 && !newsLoading && (
                            <div className="text-center py-12 text-gray-500">Новостей нет</div>
                        )}

                        {news.map(n => (
                            <div
                                key={n.id}
                                className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-gray-900 font-semibold truncate">{n.title}</h3>
                                            {n.isFeatured && <Badge variant="secondary">Featured</Badge>}
                                            <Badge variant="outline">{n.category}</Badge>
                                            <Badge variant="outline">{n.badge}</Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(n.date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => setNewsPreviewId(n.id)}>
                                            Просмотреть
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setNewsForm({
                                                    title: n.title,
                                                    description: n.description,
                                                    content: n.content,
                                                    category: n.category,
                                                    badge: n.badge,
                                                    isFeatured: n.isFeatured,
                                                    date: n.date ? new Date(n.date).toISOString().slice(0, 16) : '',
                                                    image: null,
                                                });
                                                setNewsEdit(n);
                                            }}
                                        >
                                            Редактировать
                                        </Button>

                                        <Button size="sm" variant="destructive" onClick={() => setNewsDeleteConfirm(n)}>
                                            Удалить
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700">{n.description}</p>
                            </div>
                        ))}
                    </div>
                )}
                {view === 'deals' && (
                    <div className="space-y-4">
                        {deals.length === 0 && !isLoading && (
                            <div className="text-center py-12 text-gray-500">Сделок нет</div>
                        )}

                        {deals.map(d => {
                            const statusLabel =
                                d.status === 0 ? 'Pending' :
                                    d.status === 1 ? 'Active' :
                                        d.status === 2 ? 'Rejected' :
                                            d.status === 3 ? 'Cancelled' : 'Completed';

                            const statusVariant =
                                d.status === 1 ? 'secondary' :
                                    d.status === 2 ? 'destructive' : 'outline';

                            return (
                                <div
                                    key={d.dealId}
                                    className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h3 className="text-gray-900 font-semibold truncate">{d.contextTitle}</h3>
                                            <p className="text-xs text-gray-400 truncate">
                                                Deal: {d.dealId} · Conv: {d.conversationId}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge variant={statusVariant as any}>{statusLabel}</Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">Владелец</p>
                                            <p className="text-sm text-gray-900 font-medium truncate">{d.owner.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{d.owner.email}</p>
                                            <div className="mt-2">
                                                <Badge variant={d.ownerAccepted ? 'secondary' : 'outline'}>
                                                    {d.ownerAccepted ? 'Accepted' : 'Not accepted'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">Инициатор</p>
                                            <p className="text-sm text-gray-900 font-medium truncate">{d.initiator.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{d.initiator.email}</p>
                                            <div className="mt-2">
                                                <Badge variant={d.initiatorAccepted ? 'secondary' : 'outline'}>
                                                    {d.initiatorAccepted ? 'Accepted' : 'Not accepted'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">Создана</p>
                                            <p className="text-sm text-gray-900">
                                                {new Date(d.createdAtUtc).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">Активиравана</p>
                                            <p className="text-sm text-gray-900">
                                                {d.activatedAtUtc ? new Date(d.activatedAtUtc).toLocaleString() : '—'}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">Закрыта</p>
                                            <p className="text-sm text-gray-900">
                                                {d.closedAtUtc ? new Date(d.closedAtUtc).toLocaleString() : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>



            {banConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl border p-5 space-y-3">
                        <div className="text-gray-900 font-semibold text-lg">Подтвердите бан</div>
                        <div className="text-sm text-gray-600">
                            Забанить пользователя{' '}
                            <span className="font-medium text-gray-900">
                {banConfirm.name?.trim() ? banConfirm.name : banConfirm.email}
              </span>
                            ?
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setBanConfirm(null)}>
                                Отмена
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={async () => {
                                    const id = banConfirm.id;
                                    setBanConfirm(null);
                                    await banUser(id);
                                }}
                            >
                                Забанить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {makeAdminConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl border p-5 space-y-3">
                        <div className="text-gray-900 font-semibold text-lg">
                            Подтвердите действие
                        </div>

                        <div className="text-sm text-gray-600">
                            Назначить пользователя{' '}
                            <span className="font-medium text-gray-900">
          {makeAdminConfirm.name?.trim()
              ? makeAdminConfirm.name
              : makeAdminConfirm.email}
        </span>{' '}
                            администратором?
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setMakeAdminConfirm(null)}>
                                Отмена
                            </Button>
                            <Button
                                onClick={async () => {
                                    const id = makeAdminConfirm.id;
                                    setMakeAdminConfirm(null);
                                    await makeAdmin(id);
                                }}
                            >
                                Сделать админом
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {unbanConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl border p-5 space-y-3">
                        <div className="text-gray-900 font-semibold text-lg">
                            Подтвердите действие
                        </div>

                        <div className="text-sm text-gray-600">
                            Разбанить пользователя{' '}
                            <span className="font-medium text-gray-900">
          {unbanConfirm.name?.trim()
              ? unbanConfirm.name
              : unbanConfirm.email}
        </span>
                            ?
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setUnbanConfirm(null)}>
                                Отмена
                            </Button>
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    const id = unbanConfirm.id;
                                    setUnbanConfirm(null);
                                    await unbanUser(id);
                                }}
                            >
                                Разбанить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {newsCreateOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl border p-5 space-y-4">
                        <div className="text-gray-900 font-semibold text-lg">Добавить новость</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label>Заголовок</Label>
                                <Input value={newsForm.title} onChange={e => setNewsForm(s => ({ ...s, title: e.target.value }))} />
                                {!newsValidation.title && (
                                    <p className="text-xs text-red-500">
                                        Заголовок: 5–200 символов
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Категория</Label>
                                <Input value={newsForm.category} onChange={e => setNewsForm(s => ({ ...s, category: e.target.value }))} />
                                {!newsValidation.category && (
                                    <p className="text-xs text-red-500">Категория обязательна</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Badge</Label>
                                <Input value={newsForm.badge} onChange={e => setNewsForm(s => ({ ...s, badge: e.target.value }))} />
                                {!newsValidation.badge && (
                                    <p className="text-xs text-red-500">Badge обязателен</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Дата (опционально)</Label>
                                <Input
                                    type="datetime-local"
                                    value={newsForm.date}
                                    onChange={e => setNewsForm(s => ({ ...s, date: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label>Описание</Label>
                            <Input value={newsForm.description} onChange={e => setNewsForm(s => ({ ...s, description: e.target.value }))} />
                            {!newsValidation.description && (
                                <p className="text-xs text-red-500">Описание обязательно</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Контент</Label>
                            <textarea
                                className="w-full min-h-[160px] rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                value={newsForm.content}
                                onChange={e => setNewsForm(s => ({ ...s, content: e.target.value }))}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Минимум 20 символов</span>
                                <span
                                    className={
                                        newsForm.content.trim().length < 20
                                            ? 'text-red-500'
                                            : 'text-green-600'
                                    }
                                >
    {newsForm.content.trim().length}/20
  </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <Checkbox
                                    checked={newsForm.isFeatured}
                                    onCheckedChange={(v: any) => setNewsForm(s => ({ ...s, isFeatured: Boolean(v) }))}
                                />
                                Featured
                            </label>

                            <div className="text-sm">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setNewsForm(s => ({ ...s, image: e.target.files?.[0] ?? null }))}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setNewsCreateOpen(false)}>Отмена</Button>
                            <Button
                                disabled={!isNewsFormValid}
                                onClick={async () => {
                                    try {
                                        await adminService.createNews({
                                            title: newsForm.title,
                                            content: newsForm.content,
                                            description: newsForm.description,
                                            category: newsForm.category,
                                            badge: newsForm.badge,
                                            isFeatured: newsForm.isFeatured,
                                            date: newsForm.date ? new Date(newsForm.date).toISOString() : undefined,
                                            image: newsForm.image,
                                        });

                                        toast.success('Новость создана');
                                        setNewsCreateOpen(false);
                                        loadNews();
                                    } catch (e: any) {
                                        console.log('STATUS', e?.response?.status);
                                        console.log('DATA', e?.response?.data);
                                        console.log('createNews error:', e?.response?.data ?? e);
                                        const errs = e?.response?.data?.errors;
                                        const msg = errs
                                            ? Object.entries(errs).map(([k, v]: any) => `${k}: ${(v || []).join(', ')}`).join('\n')
                                            : (e?.response?.data?.title || e?.response?.data?.message || 'Ошибка при сохранении');

                                        toast.error(msg);
                                    }
                                }}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {newsPreviewId && (
                <div className="fixed inset-0 z-50 bg-black/50">
                    <div className="h-full w-full bg-white overflow-y-auto overscroll-contain">
                        <NewsDetailScreen
                            newsId={newsPreviewId}
                            onBack={() => setNewsPreviewId(null)}
                            onOpenNews={(id) => setNewsPreviewId(id)}
                        />
                    </div>
                </div>
            )}
            {newsEdit && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl border p-5 space-y-4">
                        <div className="text-gray-900 font-semibold text-lg">Редактировать новость</div>

                        {/* те же поля что и create */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label>Заголовок</Label>
                                <Input value={newsForm.title} onChange={e => setNewsForm(s => ({ ...s, title: e.target.value }))} />
                                {!newsValidation.title && (
                                    <p className="text-xs text-red-500">
                                        Заголовок: 5–200 символов
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Категория</Label>
                                <Input value={newsForm.category} onChange={e => setNewsForm(s => ({ ...s, category: e.target.value }))} />
                                {!newsValidation.category && (
                                    <p className="text-xs text-red-500">
                                        Категория обязательна
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Badge</Label>
                                <Input value={newsForm.badge} onChange={e => setNewsForm(s => ({ ...s, badge: e.target.value }))} />
                                {!newsValidation.badge && (
                                    <p className="text-xs text-red-500">
                                        Badge обязателен
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Дата (опционально)</Label>
                                <Input value={newsForm.date} onChange={e => setNewsForm(s => ({ ...s, date: e.target.value }))} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label>Описание</Label>
                            <Input value={newsForm.description} onChange={e => setNewsForm(s => ({ ...s, description: e.target.value }))} />
                            {!newsValidation.description && (
                                <p className="text-xs text-red-500">
                                    Описание обязательно
                                </p>
                            )}

                        </div>

                        <div className="space-y-1">
                            <Label>Контент</Label>
                            <textarea
                                className="w-full min-h-[160px] rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                value={newsForm.content}
                                onChange={e => setNewsForm(s => ({ ...s, content: e.target.value }))}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Минимум 20 символов</span>
                                <span
                                    className={
                                        newsForm.content.trim().length < 20
                                            ? 'text-red-500'
                                            : 'text-green-600'
                                    }
                                >
    {newsForm.content.trim().length}/20
  </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <Checkbox
                                    checked={newsForm.isFeatured}
                                    onCheckedChange={(v: any) => setNewsForm(s => ({ ...s, isFeatured: Boolean(v) }))}
                                />
                                Featured
                            </label>

                            <div className="text-sm">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setNewsForm(s => ({ ...s, image: e.target.files?.[0] ?? null }))}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setNewsEdit(null)}>Отмена</Button>
                            <Button
                                disabled={!isNewsFormValid}
                                onClick={async () => {
                                    const id = newsEdit.id;
                                    await adminService.updateNews(id, {
                                        title: newsForm.title,
                                        content: newsForm.content,
                                        description: newsForm.description,
                                        category: newsForm.category,
                                        badge: newsForm.badge,
                                        isFeatured: newsForm.isFeatured,
                                        date: newsForm.date ? new Date(newsForm.date).toISOString() : undefined,
                                        image: newsForm.image,
                                    });
                                    setNewsEdit(null);
                                    loadNews();
                                }}
                            >
                                Обновить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {newsDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl border p-5 space-y-3">
                        <div className="text-gray-900 font-semibold text-lg">Подтвердите удаление</div>
                        <div className="text-sm text-gray-600">
                            Удалить новость <span className="font-medium text-gray-900">{newsDeleteConfirm.title}</span>?
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setNewsDeleteConfirm(null)}>Отмена</Button>
                            <Button
                                variant="destructive"
                                onClick={async () => {
                                    const id = newsDeleteConfirm.id;
                                    setNewsDeleteConfirm(null);
                                    await adminService.deleteNews(id);
                                    loadNews();
                                }}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
