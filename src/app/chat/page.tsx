import React from 'react';

export default function ChatPage() {
    return (
        <main className="flex-1 md:flex hidden flex-col items-center justify-center bg-[#F8F9FA] p-6 text-center">
            <div className="max-w-sm w-full">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        💬
                    </div>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                    Start a Conversation
                </h2>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                    Select a chat from the list or start a new one to begin your conversation.
                </p>
            </div>
        </main>
    );
}
