import CropModal from "@/components/cropper/cropModal";
import { updateUserCover } from "@/services/api/user-apis";
import { SanitizedUser } from "@/utils/sanitizer/user"
import { Camera } from "lucide-react"
import React, { useEffect, useRef, useState } from "react";


const ProfileCover = ({ user, isOwner }: { user: SanitizedUser, isOwner: boolean }) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newCover, setNewCover] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    // When user selects a file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setSelectedFile(url);
        setShowCropper(true); // open cropper modal
    };

    // When cropping is done
    const handleCropDone = async (croppedBlob: Blob, croppedUrl: string) => {
        await updateUserCover({
            file: croppedBlob,
            onDone: (data) => { console.log("Uploaded successfully", data) },
            setError: setError
        });
        setNewCover(croppedUrl)
    };

    useEffect(() => {
        if (error) {
            console.log("Error uploading", error);
        }
    }, [error])

    return (
        <React.Fragment>
            <div className="relative w-full h-60 bg-gray-300">
                {newCover || user?.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={newCover || user?.cover}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-neutral-800">
                        No Cover Photo
                    </div>
                )}
                {
                    isOwner && (
                        <>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full">
                                <Camera size={18} />
                            </button>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
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
                        ratio={3 / 1}
                        onClose={() => setShowCropper(false)}
                        onSave={handleCropDone}
                    />
                )
            }
        </React.Fragment>
    )
}

export default ProfileCover