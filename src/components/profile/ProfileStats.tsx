import { SanitizedUser } from "@/utils/sanitizer/user";
import React from "react";
import FollowModal from "../modal/FollowModal";

export default function ProfileDetails({ user, followers }: {
    user: SanitizedUser | null;
    followers: number;
}) {

    const [isFollowingOpen, setIsFollowingOpen] = React.useState(false);
    const [isFollowersOpen, setIsFollowersOpen] = React.useState(false);

    return (
        <React.Fragment>
            <React.Fragment>
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {user?.name || user?.username}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>

                    {/* Followers / Following */}
                    <div className="flex justify-center md:justify-start gap-6 mt-3">
                        <div onClick={() => setIsFollowersOpen(true)}
                            key="followers"
                            className="cursor-pointer">
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {followers ?? user?.followersCount ?? 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                        </div>
                        <div onClick={() => setIsFollowingOpen(true)}
                            key="following"
                            className="cursor-pointer">
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {user?.followingCount ?? 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>



            <React.Fragment>
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
            </React.Fragment>
        </React.Fragment>
    );
}