import Avatar from '@/components/template/avatar'
import apiInstance from '@/lib/axios';
import { IConversationPopulated } from '@/models/Conversation';
import { SanitizedUser } from '@/utils/sanitizer/user';
import { Types } from 'mongoose';
import { Session } from 'next-auth';
import React, { useCallback, useEffect } from 'react'

type Props = {
  rooms: IConversationPopulated[];
  session: Session;
  setActiveRoom: (x: IConversationPopulated) => void;
  setNewChat: (x: boolean) => void;
}

function SuggestionChat({ session, rooms, setActiveRoom, setNewChat }: Props) {

  const busyRef = React.useRef(false);
  const [users, setUsers] = React.useState<SanitizedUser[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchSuggestions = React.useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setLoading(true);
    try {
      const data = await (await apiInstance.get('/api/chat/conversation/suggestions')).data;
      const sugg = data?.filter((u: SanitizedUser) => !rooms.some(r => r.participants.some(p => p._id.toString() === u._id.toString())));
      setUsers(sugg);
    } catch (error) {
      console.log(error);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [rooms]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions])

  const createNewChatModel = useCallback((receiver: SanitizedUser): IConversationPopulated => {
    return {
      _id: new Types.ObjectId(),
      participants: [{
        _id: new Types.ObjectId(session.user.id),
        username: session.user.username,
        name: session?.user?.name || undefined,
        image: session.user.image || undefined,
      }, {
        _id: new Types.ObjectId(receiver._id),
        username: receiver.username,
        name: receiver.name || undefined,
        image: receiver.image || undefined,
      }],
      is_group: false,
      group_image: undefined,
      group_name: undefined,
      last_message: undefined,
      created_at: new Date(),
      updated_at: new Date(),
    }
  }, [session.user.id, session.user.image, session.user?.name, session.user.username])

  const manageNewChat = useCallback((receiver: SanitizedUser) => {
    const newRoom = createNewChatModel(receiver);
    setNewChat(true);
    setActiveRoom(newRoom);
  }, [createNewChatModel, setActiveRoom, setNewChat])

  return (
    <React.Fragment>
      {loading ? (
        // Skeleton UI
        Array.from({ length: 4 }).map((_, i) => (
          <li
            key={`skeleton-${i}`}
            className="flex items-center gap-3 px-2 py-2 rounded-md animate-pulse"
          >
            <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-3 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </li>
        ))
      ) : (
        users?.length > 0 &&
        users.map((u) => (
          <li
            className="flex items-center gap-3 px-2 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer"
            onClick={() => manageNewChat(u)}
            key={`${u._id.toString()}-suggestion`}
          >
            <Avatar user={{ ...u, _id: u._id.toString() }} size={9} />
            <div className="flex-1 text-sm">
              <div className="font-medium">{u.name || u.username}</div>
            </div>
            <button className="text-sm text-blue-600">Message</button>
          </li>
        ))
      )}
    </React.Fragment>
  )
}

export default SuggestionChat
