// components/skeletons/SkeletonPostCard.tsx
export default function SkeletonPostCard() {
    return (
        <div className="animate-pulse p-4 bg-white rounded-lg shadow w-full mb-4">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
            <div className="h-6 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
    );
}
