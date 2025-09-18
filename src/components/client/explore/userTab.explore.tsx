import Avatar from '@/components/ui/avatar';
import { SanitizedUser } from '@/utils/sanitizer/user';
import React from 'react'

type Props = {
    resultUsers: SanitizedUser[];
}

function UserTab({ resultUsers }: Props) {
    return (
        <div className="space-y-3">
            {resultUsers.length > 0 ? (
                resultUsers.map((u) => (
                    <div key={u._id.toString()} className="rounded-xl bg-white/90 dark:bg-neutral-800/80 p-3 shadow flex items-center gap-3">
                        {/* <img src={u.image} alt="" className="w-12 h-12 rounded-full object-cover" /> */}
                        <Avatar user={u} key={u._id.toString() + "avatar"} size={12} />
                        <div className="flex-1">
                            <div className="font-semibold">{u.name}</div>
                            <div className="text-xs opacity-70">@{u.username}</div>
                        </div>
                        <button onClick={() => window.location.href = `/${u.username}`} className="px-3 py-1 rounded-md bg-[#2D3436] text-white">View</button>
                    </div>
                ))
            ) : (
                <div className="text-center text-sm opacity-70">No users found</div>
            )
            }
        </div>
    )
}

export default UserTab