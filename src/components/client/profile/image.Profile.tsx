import CropModal from "@/components/cropper/cropModal";
import { updateUserProfilePic } from "@/services/api/user-apis";
import { SanitizedUser } from "@/utils/sanitizer/user";
import { Camera } from "lucide-react";
import React, { useState } from "react";

const ProfilePic = ({ user, isOwner }: { user: SanitizedUser, isOwner: boolean }) => {
    // HTML Refs
    const inputRef = React.useRef<HTMLInputElement>(null);

    // UI States
    const [showCropper, setShowCropper] = React.useState<boolean>(false);


    // Image States
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [cropped, setCropped] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file); // Creating Object Local URL
        setSelectedFile(url); // Setting the local Object URL as the selectedFile
        setShowCropper(true); // open cropper modal
    };

    const handleCropDone = async (croppedBlob: Blob, croppedUrl: string) => {
        await updateUserProfilePic({ file: croppedBlob });
        setCropped(croppedUrl);
    };


    return (
        <React.Fragment>
            <div className="relative w-32 h-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={cropped || user?.image || '/images/default-profile.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                {
                    isOwner && (
                        <>
                            <button
                                onClick={() => inputRef.current?.click()}
                                className="absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded-full">
                                <Camera size={16} />
                            </button>
                            <input
                                ref={inputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                type="file"
                                name="profile_pic"
                                id="profile_pic"
                                className="hidden"
                            />
                        </>
                    )
                }
            </div>


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
    )
}

export default ProfilePic;