'use client';

import Avatar from "@/components/template/avatar";
import { getUserConnectionList } from "@/services/api/user-apis";
import { ShortUser } from "@/utils/sanitizer/user";
import { Types } from "mongoose";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ConnectionsTabProps = {
    user_id: Types.ObjectId;
    type: "followers" | "following";
};

const ConnectionsTab = ({ user_id, type }: ConnectionsTabProps) => {

    const router = useRouter();

    const [connections, setConnections] = useState<ShortUser[]>([]);

    useEffect(() => {
        const fetchConnections = async () => {
            const res = await getUserConnectionList({ id: user_id, type });
            setConnections(res);
        };

        if (user_id) fetchConnections();
    }, [user_id, type]);

    return (
        <div className="space-y-3">
            {connections?.map((c) => (
                <div
                    key={c._id.toString()}
                    onClick={() => router.push(`/${c.username}`)}
                    className="bg-white dark:bg-dark-bg/90 p-4 rounded-2xl shadow flex items-center gap-3 cursor-pointer"
                >
                    <Avatar user={c} size={12} key={c._id.toString() + "avatar"} />
                    <span className="font-medium">{c.name || c.username}</span>
                </div>
            ))}
        </div>
    );
};

export default ConnectionsTab;