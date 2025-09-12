"use client";

import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: false, // connect only when needed
});

export default socket;
