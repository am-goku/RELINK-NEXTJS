import { IUser } from '@/models/User';
import { searchService } from '@/services/apiServices';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

type Props = {
    searchKey: string
}

const allTags = ['fitness', 'travel', 'coding', 'design', 'food'];

function SearchResult({ searchKey }: Props) {

    const [users, setUsers] = useState<IUser[]>([]);

    const filteredTags = allTags.filter((tag) =>
        tag.toLowerCase().includes(searchKey.toLowerCase())
    );

    useEffect(() => {
        searchService.searchUsers(searchKey, 1, true).then((res) => {
            setUsers(res.data.users);
        }).catch((err) => console.log(err))
    }, [searchKey])


    return (
        <React.Fragment>
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-md z-10 max-h-[400px] overflow-y-auto p-4 space-y-4 text-sm">

                {/* Users */}
                {users.length > 0 && (
                    <div>
                        <p className="font-semibold text-[#2D3436] mb-2">Users</p>
                        {users.slice(0, 3).map((user) => (
                            <div
                                key={user._id.toString()}
                                className="flex items-center gap-3 py-2 px-2 hover:bg-gray-100 rounded-md cursor-pointer"
                            >
                                <Image
                                    src={user.image || '/images/default-profile.png'}
                                    alt={user.name || user.username}
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <p>{user.name}</p>
                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                </div>
                            </div>
                        ))}
                        {users.length > 3 && (
                            <div className="text-[#6C5CE7] hover:underline cursor-pointer mt-1 px-2">
                                See more users...
                            </div>
                        )}
                    </div>
                )}

                {/* Tags */}
                {filteredTags.length > 0 && (
                    <div>
                        <p className="font-semibold text-[#2D3436] mb-2">Tags</p>
                        {filteredTags.slice(0, 3).map((tag, index) => (
                            <div key={index} className="py-2 px-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                #{tag}
                            </div>
                        ))}
                        {filteredTags.length > 3 && (
                            <div className="text-[#6C5CE7] hover:underline cursor-pointer mt-1 px-2">
                                See more tags...
                            </div>
                        )}
                    </div>
                )}

                {/* No results */}
                {users.length === 0 &&
                    filteredTags.length === 0 && (
                        <div className="text-center text-gray-500 py-4">
                            No results found.
                        </div>
                    )}
            </div>
        </React.Fragment>
    )
}

export default SearchResult