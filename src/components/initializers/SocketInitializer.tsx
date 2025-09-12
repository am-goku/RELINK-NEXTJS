"use client";

import socket from '@/lib/socket/socket';
import { useSession } from 'next-auth/react'
import { useEffect } from 'react';

function SocketInitializer() {

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            socket.connect(); // connect socket when user logs in
            socket.emit("register", session.user.id); // register user to socket
        } else if (status === "unauthenticated") {
            socket.disconnect(); // disconnect socket when user logs out
        }
    }, [session, status])

    return null // nothing to render, just initializes
}

export default SocketInitializer