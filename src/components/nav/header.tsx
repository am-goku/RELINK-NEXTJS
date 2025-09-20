import { Compass, Home, MessageCircle, MoreVertical, Plus, User } from 'lucide-react'
import React from 'react'
import RelinkLogo from '../icons/RelinkLogo';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUnreadStore } from '@/stores/unreadStore';
import ProfileOptionsModal from '../modal/profileOptions';

type Props = {
    page: "connect" | "dashboard" | "chat" | "profile" | "explore" | "setting";
    doFun?: () => void;
    profile_id?: string;
}

function Header({ page, profile_id, doFun }: Props) {

    const { data: session } = useSession();

    const router = useRouter();

    const [optionsModal, setOptionsModal] = React.useState<boolean>(false);

    const unreadMap = useUnreadStore((s) => s.map);
    const totalUnread = Object.keys(unreadMap).filter((k) => unreadMap[k] > 0).length;

    return (
        <React.Fragment>
            <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-light-bg/90 dark:bg-dark-bg/90 shadow-sm">
                        <RelinkLogo height={32} width={32} />
                    </div>
                    <div className='hidden md:block'>
                        <p className="text-lg font-bold">ReLink</p>
                        {page !== "connect" && <p className="text-xs opacity-70 capitalize">{page}</p>}
                        {page === "connect" && <p className="text-xs opacity-70">Connect • Share • Grow</p>}
                    </div>
                </div>

                <div className="flex items-center gap-3">

                    {/* Common Navigations */}
                    {
                        page !== "connect" && (
                            <React.Fragment>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    style={{ border: page === "dashboard" ? "2px solid #1DA1F2" : "none" }}
                                    className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:brightness-105 dark:bg-neutral-800/70 dark:ring-white/10"
                                >
                                    <Home className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => router.push('/explore')}
                                    style={{ border: page === "explore" ? "2px solid #1DA1F2" : "none" }}
                                    className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:brightness-105 dark:bg-neutral-800/70 dark:ring-white/10"
                                >
                                    <Compass className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => router.push("/chat")}
                                    style={{
                                        border: page === "chat" ? "2px solid #1DA1F2" : "none",
                                    }}
                                    className="relative flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:brightness-105 dark:bg-neutral-800/70 dark:ring-white/10"
                                >
                                    <MessageCircle className="h-4 w-4" />

                                    {totalUnread > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md">
                                            {totalUnread > 9 ? "9+" : totalUnread}
                                        </span>
                                    )}
                                </button>

                                {
                                    (page === "profile" && session?.user.id === profile_id) ? (
                                        <button
                                            onClick={() => setOptionsModal(true)}
                                            // style={{ border: page === "setting" ? "2px solid #1DA1F2" : "none" }}
                                            className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:brightness-105 dark:bg-neutral-800/70 dark:ring-white/10"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push(`/${session?.user.username}`)}
                                            style={{ border: page === "profile" ? "2px solid #1DA1F2" : "none" }}
                                            className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:brightness-105 dark:bg-neutral-800/70 dark:ring-white/10"
                                        >
                                            <User className="h-4 w-4" />
                                        </button>
                                    )
                                }
                            </React.Fragment>
                        )
                    }


                    {/* Dashboard Specified Button */}
                    {
                        page === "dashboard" && (
                            <button
                                onClick={doFun}
                                className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 hover:brightness-105 dark:bg-neutral-800/70 dark:ring-white/10"
                            >
                                <Plus className="h-4 w-4" /> New post
                            </button>
                        )
                    }

                    {/* Connect Specified Section */}
                    {
                        page === "connect" && (
                            <div className="hidden md:block text-sm opacity-80">Welcome to your social hub</div>
                        )
                    }
                </div>
            </header>

            {optionsModal && <ProfileOptionsModal open={optionsModal} profile_id={profile_id} onClose={() => setOptionsModal(false)} />}
        </React.Fragment>
    )
}

export default Header