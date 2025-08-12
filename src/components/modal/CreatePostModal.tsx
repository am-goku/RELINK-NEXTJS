'use client';

import { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import '../../styles/cropper.css'
import { getCroppedImg } from '@/utils/cropper/cropImage';
import CropComponent from './CropComponent';
import LoadingModal from '../loaders/LoadingModal';

type CroppedArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Handling Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  // Handling Image Removal
  const handleRemoveImage = () => {
    setImage(undefined);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submiting Data to the Backend
  const handleSubmit = async () => {
    try {
      if (!content.trim() && !image) return;

      setLoading(true);

      const formData = new FormData();
      if (content.trim()) formData.append('content', content.trim());
      if (image) formData.append('image', image);

      formData.forEach((key) => console.log(key))

      // TODO: Send formData to backend and manage it in the front end
      const res = await axios.post('/api/posts', formData);

      console.log(res.data)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
      onClose();
    }

  };

  // Handling Cropped Image Pixels
  const cropDone = async (croppedAreaPixels: CroppedArea | null) => {
    if (!preview) return;

    try {
      if (croppedAreaPixels) {
        const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);
        const file = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' });
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    } catch (err) {
      console.error('Crop failed', err);
    }

    setShowCropper(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h3 className="text-xl font-semibold mb-4">Create New Post</h3>

          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-md mb-4 resize-none min-h-[100px] focus:outline-none focus:ring focus:border-blue-300"
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
                className="border-2 border-dashed border-gray-300 p-6 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex flex-col items-center text-gray-500">
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
            disabled={!content.trim() && !image}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${content.trim() || image
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            Post
          </button>
        </div>
      </div>

      {/* Cropping Modal Section */}
      {showCropper && preview && (
        <CropComponent
          image={preview}
          onClose={() => setShowCropper(false)}
          cropDone={cropDone}
        />
      )}

      {/* Loading Modal Section */}
      {loading && (<LoadingModal message='Uploading' />)}
    </>
  );
}
