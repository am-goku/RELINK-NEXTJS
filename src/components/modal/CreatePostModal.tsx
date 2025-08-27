'use client';

import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import '../../styles/cropper.css'
import LoadingModal from '../ui/loaders/LoadingModal';
import { createNewPost } from '@/services/api/post-apis';
import CropModal from '../cropper/cropModal';

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Content State
  const [content, setContent] = useState('');

  // Image States
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  // Util States
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [showCropper, setShowCropper] = useState(false);

  // Handling Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  // Handling Image Removal
  const handleRemoveImage = () => {
    setCroppedImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submiting Data to the Backend
  const handleSubmit = async () => {
    setLoading(true);
    await createNewPost({
      content: content,
      file: croppedImage,
      setError,
      doFun: () => {
        setLoading(false);
        onClose();
      }
    })
  };

  // Error handling
  useEffect(() => {
    if (error) {
      console.log(error)
    }
  }, [error])

  const handleCropDone = async (croppedBlob: Blob, croppedUrl: string) => {
    setCroppedImage(croppedBlob);
    setPreview(croppedUrl);
  };

  return (
    <React.Fragment>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Create New Post
          </h3>

          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-md mb-4 resize-none min-h-[100px] 
                 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100
                 focus:outline-none focus:ring focus:border-blue-300"
          />

          <div className="mb-4">
            {preview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-md object-cover max-h-60"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-neutral-700 
                     p-6 flex items-center justify-center rounded-md cursor-pointer 
                     hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
              >
                <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                  <PhotoIcon className="h-8 w-8 mb-2" />
                  <span className="text-sm">Click to upload an image (optional)</span>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() && !croppedImage}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${content.trim() || croppedImage
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 dark:bg-neutral-700 cursor-not-allowed'
              }`}
          >
            Post
          </button>
        </div>
      </div>

      {showCropper && (
        <CropModal
          isOpen={showCropper}
          imageSrc={uploadedImage || ""}
          onClose={() => setShowCropper(false)}
          onSave={handleCropDone}
        />
      )}

      {/* Loading Modal Section */}
      {loading && (<LoadingModal message='Uploading' />)}
    </React.Fragment>
  );
}
