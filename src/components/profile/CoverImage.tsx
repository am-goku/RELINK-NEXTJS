import { SanitizedUser } from "@/utils/sanitizer/user";
import { Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CropModal from "../cropper/cropModal";
import { updateUserCover } from "@/services/api/user-apis";

type Props = {
  user: SanitizedUser | null;
  setUser?: React.Dispatch<React.SetStateAction<SanitizedUser | null>>;
  isOwner: boolean;
}

export default function CoverImage({ user, setUser, isOwner }: Props) {

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUser?.(prev => prev && { ...prev, cover: croppedUrl });
    console.log(croppedBlob, "loading....");

    await updateUserCover({
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

  return (
    <React.Fragment>
      <div
        className="w-full h-48 md:h-64 bg-cover bg-center relative"
        style={{
          // backgroundImage: `url(${user?.cover || "/images/default-cover.jpg"})`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <Image
          src={user?.cover || "/images/default-cover.png"}
          alt="Cover Image"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-700 ease-in-out hover:scale-105"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-colors"></div>

        {/* Update Button */}
        {
          isOwner && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-3 right-3 bg-white/70 dark:bg-black/70 p-2 rounded-full shadow hover:bg-white dark:hover:bg-black transition"
              >
                <Pencil size={18} />
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

      {/* Cropper modal */}
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
  );
}