import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { adminService, AdminUserDto, AdminConversationDto } from '../services/adminService';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [banConfirm, setBanConfirm] = useState<AdminUserDto | null>(null);
    const [makeAdminConfirm, setMakeAdminConfirm] = useState<AdminUserDto | null>(null);
    const [unbanConfirm, setUnbanConfirm] = useState<AdminUserDto | null>(null);
    const [view, setView] = useState<'users' | 'conversations'>('users');
    const [conversations, setConversations] = useState<AdminConversationDto[]>([]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setUsers(await adminService.getUsers());
        } finally {
            setIsLoading(false);
        }
    };

    const loadConversations = async () => {
        try {
            setIsLoading(true);
            setConversations(await adminService.getConversations());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'users') loadUsers();
        else loadConversations();
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
                                {view === 'users' ? 'Управление пользователями' : 'Все конверсейшены'}
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
                                variant={view === 'conversations' ? 'default' : 'outline'}
                                onClick={() => {
                                    setView('conversations');
                                    loadConversations();
                                }}
                                size="sm"
                            >
                                Конверсейшены
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            onClick={view === 'users' ? loadUsers : loadConversations}
                            disabled={isLoading}
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
                {view === 'conversations' && (
                    <div className="space-y-4">
                        {conversations.length === 0 && !isLoading && (
                            <div className="text-center py-12 text-gray-500">Конверсейшенов нет</div>
                        )}

                        {conversations.map(c => (
                            <div
                                key={c.conversationId}
                                className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h3 className="text-gray-900 font-semibold truncate">
                                            {c.contextTitle}
                                        </h3>
                                        <p className="text-xs text-gray-400 truncate">{c.contextId}</p>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        {new Date(c.updatedAtUtc).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* between who */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Owner</p>
                                        <p className="text-sm text-gray-900 font-medium truncate">{c.owner.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{c.owner.email}</p>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Initiator</p>
                                        <p className="text-sm text-gray-900 font-medium truncate">{c.initiator.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{c.initiator.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
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
        </div>
    );
}
