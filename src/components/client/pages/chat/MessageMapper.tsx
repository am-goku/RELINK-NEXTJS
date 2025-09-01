import { IConversationPopulated } from '@/models/Conversation';
import { IMessage } from '@/models/Message';
import clsx from 'clsx';
import React from 'react'

type Props = {
    messages: IMessage[];
    receiver: IConversationPopulated['participants'][0];
}

function MessageMapper({ messages, receiver }: Props) {

    return (
        <React.Fragment>
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#F8F9FA] dark:bg-neutral-900 transition-colors">
                {messages.map((msg) => (
                    <div
                        key={msg._id.toString()}
                        className={clsx(
                            'max-w-[80%] sm:max-w-sm px-4 py-2 rounded-xl text-sm break-words transition-colors',
                            msg.sender.toString() !== receiver._id.toString()
                                ? 'ml-auto bg-[#6C5CE7] text-white'
                                : 'mr-auto bg-white dark:bg-neutral-800 dark:border-neutral-700 border'
                        )}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}

export default MessageMapper