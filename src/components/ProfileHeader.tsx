// components/ProfileHeader.tsx
import { IUser } from "@/models/User";
import Image from "next/image";

interface ProfileHeaderProps {
  user: IUser | null;
}

// export default function ProfileHeader({ user }: ProfileHeaderProps) {
//   if (!user) return null;

//   return (
//     <div className="relative flex flex-col md:flex-row items-center md:items-end px-4 md:px-10">
//       <div className="-mt-20 md:-mt-24 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
//         <Image
//           src={user.image || "/images/default-profile.png"}
//           alt="User Profile Picture"
//           width={160}
//           height={160}
//           className="object-cover w-full h-full"
//         />
//       </div>
//       <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
//         <h2 className="text-2xl font-semibold text-gray-800">{user.name || user.username}</h2>
//         <p className="text-gray-500">@{user.username}</p>
//       </div>
//     </div>
//   );
// }

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  if (!user) return null;

  return (
    <div className="relative flex flex-col md:flex-row items-center md:items-end px-4 md:px-10">
      <div className="-mt-20 md:-mt-24 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <Image
          src={user.image || "/images/default-profile.png"}
          alt="User Profile Picture"
          width={160}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
        <h2 className="text-2xl font-semibold text-gray-800">{user.name || user.username}</h2>
        <p className="text-gray-500">@{user.username}</p>
      </div>
    </div>
  );
}