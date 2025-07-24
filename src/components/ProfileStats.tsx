// components/ProfileStats.tsx
export default function ProfileStats() {
    return (
        <div className="px-4 md:px-10 mt-6 md:mt-4 flex space-x-6 text-gray-700">
            <div>
                <p className="text-xl font-semibold">120</p>
                <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div>
                <p className="text-xl font-semibold">80</p>
                <p className="text-sm text-gray-500">Following</p>
            </div>
        </div>
    );
}