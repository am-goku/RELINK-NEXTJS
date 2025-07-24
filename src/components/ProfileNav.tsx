// components/ProfileNav.tsx
export default function ProfileNav() {
    return (
        <div className="px-4 md:px-10 mt-4 md:mt-6 flex justify-start space-x-6 text-blue-600 font-medium">
            <button className="hover:underline">Posts</button>
            <button className="hover:underline">Profile</button>
            <button className="hover:underline">Friends</button>
        </div>
    );
}