import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { IPublicPost } from '@/utils/sanitizer/post';

type Props = {
    modalIndex: number;
    imagePosts: IPublicPost[];
    setModalIndex: React.Dispatch<React.SetStateAction<number>>;
    setModalOpen: (open: boolean) => void;
}

function ExploreModal({ imagePosts, modalIndex, setModalIndex, setModalOpen }: Props) {

    function goNext() { setModalIndex((s: number) => Math.min(imagePosts.length - 1, s + 1)); }
    function goPrev() { setModalIndex((s: number) => Math.max(0, s - 1)); }

    function closeModal() {
        setModalOpen(false);
        document.body.style.overflow = "";
    }

    return (
        <React.Fragment>
            {
                imagePosts.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                        <div className="absolute top-4 left-4 text-white">
                            <button onClick={closeModal} className="rounded-full bg-black/40 p-2"><X /></button>
                        </div>

                        <div className="relative w-full max-w-md h-[90vh] sm:max-w-2xl sm:h-[92vh]">
                            <motion.div key={modalIndex} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="w-full h-full rounded-xl overflow-hidden bg-black flex flex-col">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imagePosts[modalIndex].image} alt="reel" className="w-full h-full object-contain" />
                                <div className="absolute bottom-6 left-6 text-white max-w-[60%]">
                                    <div className="font-bold">{imagePosts[modalIndex].user.username}</div>
                                    {imagePosts[modalIndex].content && <div className="mt-2 text-sm opacity-90">{imagePosts[modalIndex].content}</div>}
                                </div>
                            </motion.div>

                            {/* navigation */}
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                                <button onClick={goPrev} disabled={modalIndex === 0} className="rounded-full bg-black/40 p-2 text-white"><ArrowUp /></button>
                                <button onClick={goNext} disabled={modalIndex === imagePosts.length - 1} className="rounded-full bg-black/40 p-2 text-white"><ArrowDown /></button>
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </React.Fragment>
    )
}

export default ExploreModal