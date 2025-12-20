import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { adminService, AdminUserDto } from '../services/adminService';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [banConfirm, setBanConfirm] = useState<AdminUserDto | null>(null);
    const [makeAdminConfirm, setMakeAdminConfirm] = useState<AdminUserDto | null>(null);
    const [unbanConfirm, setUnbanConfirm] = useState<AdminUserDto | null>(null);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setUsers(await adminService.getUsers());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

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
                            <p className="text-sm text-gray-500">Управление пользователями</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Пользователей: {stats.total}</Badge>
                        <Badge variant="outline">Админов: {stats.admins}</Badge>
                        <Badge variant="outline">Забанено: {stats.banned}</Badge>

                        <Button variant="outline" onClick={loadUsers} disabled={isLoading}>
                            {isLoading ? '...' : 'Обновить'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="bg-white rounded-2xl border overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                        <div className="col-span-3">Имя</div>
                        <div className="col-span-4">Email</div>
                        <div className="col-span-2">Роль</div>
                        <div className="col-span-1">Статус</div>
                        <div className="col-span-2 text-right">Действия</div>
                    </div>

                    {users.length === 0 && !isLoading && (
                        <div className="px-4 py-10 text-center text-gray-500">Пользователей нет</div>
                    )}

                    {users.map(u => {
                        const isAdmin = (u.role || '').toLowerCase() === 'admin';

                        return (
                            <div
                                key={u.id}
                                className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-b-0 items-center"
                            >
                                <div className="col-span-3 text-gray-900 font-medium truncate">
                                    {u.name?.trim() ? u.name : '—'}
                                </div>

                                <div className="col-span-4 text-gray-700 truncate">{u.email}</div>

                                <div className="col-span-2">
                                    <Badge variant={isAdmin ? 'secondary' : 'outline'}>
                                        {u.role || '—'}
                                    </Badge>
                                </div>

                                <div className="col-span-1">
                                    {u.isBanned ? (
                                        <Badge variant="destructive">Забанен</Badge>
                                    ) : (
                                        <Badge variant="outline">Активен</Badge>
                                    )}
                                </div>

                                <div className="col-span-2 flex justify-end gap-2">
                                    {!isAdmin && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={u.isBanned}
                                            onClick={() => setMakeAdminConfirm(u)}
                                        >
                                            Сделать админом
                                        </Button>
                                    )}

                                    {!u.isBanned ? (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setBanConfirm(u)}
                                        >
                                            Забанить
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
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
