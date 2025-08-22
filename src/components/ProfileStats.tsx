import { SanitizedUser } from "@/utils/sanitizer/user";
import React from "react";
import FollowModal from "./modal/FollowModal";

export default function ProfileStats({ user, followers }: {
    user: SanitizedUser | null;
    followers: number;
}) {

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
                        <p className="text-xl font-semibold">{followers}</p>
                        <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div
                        onClick={() => { setIsFollowingOpen(true) }}
                        key="following"
                        className="cursor-pointer">
                        <p className="text-xl font-semibold">{user?.followingCount}</p>
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
                        user_id={user?._id}
                        key={"followers_modal"}
                    />
                )}

                {isFollowingOpen && user && (
                    <FollowModal
                        isOpen={isFollowingOpen}
                        onClose={() => setIsFollowingOpen(false)}
                        title="Following"
                        user_id={user?._id}
                        key={"following_modal"}
                    />
                )}
            </>
        </React.Fragment>
    );
}