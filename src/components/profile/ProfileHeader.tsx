import { SanitizedUser } from "@/utils/sanitizer/user";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { updateUserProfilePic } from "@/services/api/user-apis";
import CropModal from "../cropper/cropModal";
import ProfileDetails from "./ProfileStats";

interface ProfileHeaderProps {
  user: SanitizedUser | null;
  setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>>;
  isOwner: boolean;
  followers: number;
}

export default function ProfileHeader({ user, setUser, isOwner, followers }: ProfileHeaderProps) {
  // HTML Refs
  const inputRef = React.useRef<HTMLInputElement>(null);

  // UI States
  const [showCropper, setShowCropper] = React.useState<boolean>(false);

  // Image States
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Util States
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file); // Creating Object Local URL
    setSelectedFile(url); // Setting the local Object URL as the selectedFile
    setShowCropper(true); // open cropper modal
  };

  const handleCropDone = async (croppedBlob: Blob, croppedUrl: string) => {
    setUser?.(prev => prev && { ...prev, image: croppedUrl });
    console.log(croppedBlob, "loading....");

    await updateUserProfilePic({
      file: croppedBlob,
      onDone: (data) => { console.log("Uploaded successfully", data) },
      setError: setError
    });
  };

  useEffect(() => {
    if (error) {
      console.log("Error uploading", error);
    }
  }, [error])

  if (!user) return null;

  return (
    <React.Fragment>
      <div className="relative flex flex-col md:flex-row items-center md:items-end px-4 md:px-10 select-none" draggable={false}>
        {/* Profile Picture with edit button */}
        <div className="relative -mt-20 md:-mt-24 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg transition-colors">
          <Image
            src={user.image || "/images/default-profile.png"}
            alt="User Profile Picture"
            width={160}
            height={160}
            draggable={false}
            className="object-cover w-full h-full"
          />

          {/* Edit button overlay only if the user-profile is owned by current user */}
          {
            isOwner && (
              <>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors shadow-md"
                  aria-label="Edit profile picture"
                >
                  <Camera size={18} />
                  <input
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    type="file"
                    name="profile_pic"
                    id="profile_pic"
                    className="hidden"
                  />
                </button>
              </>
            )
          }
        </div>

        {/* User Info */}
        <ProfileDetails user={user} followers={followers} />

      </div>

      {/* Cropper modal */}
      {
        showCropper && (
          <CropModal
            isOpen={showCropper}
            imageSrc={selectedFile || ""}
            ratio={1}
            onClose={() => setShowCropper(false)}
            onSave={handleCropDone}
          />
        )
      }

    </React.Fragment>
  );
}
