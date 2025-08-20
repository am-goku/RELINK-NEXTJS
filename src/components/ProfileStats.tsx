import { IUser } from "@/models/User";

export default function ProfileStats({user}: {user: IUser}) {
    return (
        <div className="px-4 md:px-10 mt-6 md:mt-4 flex space-x-6 text-gray-700">
            <div>
                <p className="text-xl font-semibold">{user.followers.length}</p>
                <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div>
                <p className="text-xl font-semibold">{user.following.length}</p>
                <p className="text-sm text-gray-500">Following</p>
            </div>
        </div>
    );
}