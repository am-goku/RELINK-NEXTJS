import Avatar from '@/components/template/avatar';
import apiInstance from '@/lib/axios';
import { getErrorMessage } from '@/lib/errors/errorResponse';
import { SanitizedUser } from '@/utils/sanitizer/user';
import { ListX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
    query: string;
}

function UserTab({ query }: Props) {

    const router = useRouter();

    const busyRef = useRef(false)

    const [users, setUsers] = useState<SanitizedUser[]>([]);

    const fetchUsers = useCallback(async () => {
        if (busyRef.current) return;
        try {
            busyRef.current = true;
            let res = [];
            if (query) {
                res = (await apiInstance.get(`/api/users/search?searchKey=${query}`)).data;
            } else {
                res = (await apiInstance.get('/api/users/sample?size=10')).data;
            }
            setUsers(res);
        } catch (error) {
            console.error(getErrorMessage(error) || "Something went wrong. Please try again.");
        } finally {
            busyRef.current = false; // reset immediately, unless you want debounce
        }
    }, [query]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    return (
        <div className="space-y-3">
            {users.length > 0 ? (
                users.map((u) => (
                    <div key={u._id.toString()} className="rounded-xl bg-white/90 dark:bg-neutral-800/80 p-3 shadow flex items-center gap-3">
                        <Avatar user={u} key={u._id.toString() + "avatar"} size={12} />
                        <div className="flex-1">
                            <div className="font-semibold">{u.name}</div>
                            <div className="text-xs opacity-70">@{u.username}</div>
                        </div>
                        <button onClick={() => router.push(`/${u.username}`)} className="px-3 py-1 rounded-md bg-[#2D3436] text-white">View</button>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                    <ListX className="w-12 h-12 mb-4" />
                    <p>No User found</p>
                </div>
            )
            }
        </div>
    )
}

export default UserTab