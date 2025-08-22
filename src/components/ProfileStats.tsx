import { SanitizedUser } from "@/utils/sanitizer/user";
import React from "react";
import FollowModal from "./modal/FollowModal";

export default function ProfileStats({ user }: { user: SanitizedUser | null }) {

    const [isFollowingOpen, setIsFollowingOpen] = React.useState(false);
    const [isFollowersOpen, setIsFollowersOpen] = React.useState(false);

    return (
        <React.Fragment>
            <>
                <div className="px-4 md:px-10 mt-6 md:mt-4 flex space-x-6 text-gray-700">
                    <div
                        onClick={() => { setIsFollowersOpen(true) }}
                        key="followers"
                        className="cursor-pointer">
                        <p className="text-xl font-semibold">{user?.followers.length}</p>
                        <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div
                        onClick={() => { setIsFollowingOpen(true) }}
                        key="following"
                        className="cursor-pointer">
                        <p className="text-xl font-semibold">{user?.following.length}</p>
                        <p className="text-sm text-gray-500">Following</p>
                    </div>
                </div>
            </>

            <>
                {isFollowersOpen && user && (
                    <FollowModal
                        isOpen={isFollowersOpen}
                        onClose={() => setIsFollowersOpen(false)}
                        title="Followers"
                        users={user?.followers}
                        key={"followers"}
                    />
                )}

                {isFollowingOpen && user && (
                    <FollowModal
                        isOpen={isFollowingOpen}
                        onClose={() => setIsFollowingOpen(false)}
                        title="Following"
                        users={user?.following}
                        key={"following"}
                    />
                )}
            </>
        </React.Fragment>
    );
}