import { getUserConnectionList } from "@/services/api/user-apis";
import { ShortUser } from "@/utils/sanitizer/user";
import { Types } from "mongoose";
import { useEffect, useState } from "react";

export const FollowersTab = ({ user_id }: { user_id: Types.ObjectId }) => {
    const [followers, setFollowers] = useState<ShortUser[]>([]);
    useEffect(() => {
        const fetchConnections = async () => {
            const res = await getUserConnectionList({ id: user_id, type: 'followers' });
            setFollowers(res);
        }

        if (user_id) fetchConnections();

    }, [user_id])
    return (
        <div className="space-y-3">
            {followers?.map((f) => (
                <div
                    key={f._id}
                    className="bg-white dark:bg-dark-bg/90 p-4 rounded-2xl shadow flex items-center gap-3"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={f.image || '/images/default-profile.png'}
                        className="w-12 h-12 rounded-full object-cover"
                        alt={f.username}
                    />
                    <span className="font-medium">{f.name || f.username}</span>
                </div>
            ))}
        </div>
    )
}

export const FollowingTab = ({ user_id }: { user_id: Types.ObjectId }) => {

    const [following, setFollowing] = useState<ShortUser[]>([]);

    useEffect(() => {
        const fetchConnections = async () => {
            const res = await getUserConnectionList({ id: user_id, type: 'following' });
            setFollowing(res);
        }

        if (user_id) fetchConnections();

    }, [user_id])

    return (
        <div className="space-y-3">
            {following?.map((f) => (
                <div
                    key={f._id}
                    className="bg-white dark:bg-dark-bg/90 p-4 rounded-2xl shadow flex items-center gap-3"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={f.image || '/images/default-profile.png'}
                        className="w-12 h-12 rounded-full object-cover"
                        alt="Following"
                    />
                    <span className="font-medium">{f.name || f.username}</span>
                </div>
            ))}
        </div>
    )
}