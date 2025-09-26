import { SanitizedUser } from "@/utils/sanitizer/user";
import { User } from "lucide-react";

function Avatar({ user, size = 10 }: { user: Partial<SanitizedUser>; size?: number }) {
    return (
        <div className={`h-${size} w-${size} overflow-hidden rounded-full bg-gray-200`}>
            {user.image ? (
                // note: tailwind dynamic class with template string for height/width won't work without plugin; we apply inline style
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    style={{ height: `${size * 4}px`, width: `${size * 4}px` }}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-300">
                    <User className="h-4 w-4 text-white" />
                </div>
            )}
        </div>
    );
}

export default Avatar;