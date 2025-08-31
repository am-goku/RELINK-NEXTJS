import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedUser: any;
}

function ChatHeader({ selectedUser }: Props) {
    return (
        <React.Fragment>
            <div className="p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800">
                <button
                    onClick={() => redirect('/chat')}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={selectedUser?.avatar}
                        alt={selectedUser?.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{selectedUser?.name}</span>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ChatHeader