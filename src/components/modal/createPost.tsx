'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import CropModal from '../cropper/cropModal';
import PrimaryButton from '../template/primary-button';
import { createNewPost } from '@/services/api/post-apis';
import { IPublicPost } from '@/utils/sanitizer/post';
import { Checkbox } from '../template/check-box';


interface Props {
    open: boolean;
    onClose: () => void;
    updatePostList?: React.Dispatch<React.SetStateAction<IPublicPost[]>>
}

export default function CreatePostModal({ open, onClose, updatePostList }: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [step, setStep] = useState<'choose' | 'content' | 'image' | 'editor'>('choose');
    const [text, setText] = useState('');

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [loading, setLoading] = useState(false);

    // checkbox states
    const [disableComment, setDisableComment] = useState(false);
    const [disableShare, setDisableShare] = useState(false);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(URL.createObjectURL(file));
            setShowCropper(true);
        }
    };

    const handleCropDone = (blob: Blob, url: string) => {
        setCroppedImage(blob);
        setPreview(url);
        setShowCropper(false);
        setStep('editor');
    };

    const handleCreateSubmit = async () => {
        const post = await createNewPost({
            content: text.trim() || undefined,
            file: croppedImage,
            disableComment,
            disableShare
        })

        updatePostList?.((list) => [post, ...list]);
    };

    const handleSubmit = async () => {
        setLoading(true);
        await handleCreateSubmit();
        setLoading(false);
        setText('');
        setPreview(null);
        setCroppedImage(null);
        setDisableComment(false);
        setDisableShare(false);
        setStep('choose');
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/40" onClick={onClose} />

                    <motion.div
                        className="relative z-10 w-full max-w-3xl rounded-2xl bg-white/90 p-6 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-800/80 dark:ring-white/10"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: 20 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>

                        {step === 'choose' && (
                            <div className="flex flex-col items-center justify-center gap-4 py-10">
                                <h3 className="text-lg font-semibold">What do you want to create?</h3>
                                <div className="flex gap-4">
                                    <PrimaryButton onClick={() => setStep('content')}>Content Only</PrimaryButton>
                                    <PrimaryButton onClick={() => setStep('image')}>With Image</PrimaryButton>
                                </div>
                            </div>
                        )}

                        {step === 'content' && (
                            <div className="space-y-4">
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Write your post..."
                                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none min-h-[120px] resize-none bg-transparent"
                                />
                                <section className='flex gap-4'>
                                    <Checkbox checked={disableComment}
                                        onChange={setDisableComment}
                                        label="Disable comments"
                                        id='disable-comment' />

                                    <Checkbox
                                        checked={disableShare}
                                        onChange={setDisableShare}
                                        label="Disable sharing"
                                        id='disable-share' />
                                </section>
                                <div className="flex justify-end">
                                    <PrimaryButton onClick={handleSubmit} loading={loading} disabled={!text || !text.trim()}>Post</PrimaryButton>
                                </div>
                            </div>
                        )}

                        {step === 'image' && (
                            <div className="flex flex-col items-center justify-center gap-4 py-10">
                                <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                <p className="text-sm opacity-80">Upload an image to continue</p>
                                <PrimaryButton onClick={() => fileInputRef.current?.click()}>Upload Image</PrimaryButton>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>
                        )}

                        {step === 'editor' && preview && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={preview} alt="Preview" className="max-h-[60vh] w-auto rounded-xl object-contain" />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Write a description..."
                                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none min-h-[100px] resize-none bg-transparent"
                                    />
                                    <Checkbox checked={disableComment}
                                        onChange={setDisableComment}
                                        label="Disable comments"
                                        id='disable-comment' />

                                    <Checkbox
                                        checked={disableShare}
                                        onChange={setDisableShare}
                                        label="Disable sharing"
                                        id='disable-share' />

                                    <div className="flex justify-end">
                                        {/* <PrimaryCreateButton onClick={handleSubmit} loading={loading}>Post</PrimaryCreateButton> */}
                                        <PrimaryButton onClick={handleSubmit} loading={loading} disabled={!croppedImage}>Post</PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {showCropper && (
                        <CropModal
                            isOpen={showCropper}
                            imageSrc={uploadedImage || ''}
                            onClose={() => setShowCropper(false)}
                            onSave={handleCropDone}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
