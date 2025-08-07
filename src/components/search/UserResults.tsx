import { IUser } from '@/models/User';
import { searchService } from '@/services/apiServices';
import { UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react'

type Props = {
    query: string
}

function UserResults({ query }: Props) {

    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        searchService.searchUsers(query, 1, false).then((res) => {
            console.log(res.data);
            setUsers(res.data.users);
        }).catch((err) => {
            console.log(err);
        });

        return () => {
            setUsers([]);
        }

    }, [query]);


    return (
        <>
            <section>
                {/* Grid of Users */}
                {
                    users.length > 0 ? (
                        <>
                            <h2 className="text-lg font-medium mb-4">Suggested for you</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {users.map((user) => (
                                    <div
                                        key={user._id.toString()}
                                        className="w-full bg-[#F0F2F5] rounded-xl p-4 flex items-center gap-4 shadow-sm"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-grow">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-[#636E72]">@{user.username}</p>
                                        </div>
                                        <button className="p-1 text-[#6C5CE7] hover:text-opacity-80 transition">
                                            <UserPlus size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            <div className="mt-6 flex justify-center">
                                <button className="px-6 py-2 bg-[#6C5CE7] text-white rounded-full hover:bg-opacity-90 transition">
                                    Load More
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <p className="text-center text-gray-500 mt-10">No users found for “{query}”</p>
                        </div>
                    )
                }
            </section>
        </>
    )
}

export default UserResults