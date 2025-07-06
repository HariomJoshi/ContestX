// SocketProvider.tsx
import React, { createContext, useContext, useEffect, useRef } from "react";

type SocketContextValue = WebSocket | null;
const SocketContext = createContext<SocketContextValue>(null);

export const SocketProvider: React.FC<{
  url: string;
  children: React.ReactNode;
}> = ({ url, children }) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ socket open");
    ws.onerror = (e) => console.error("socket error", e);
    ws.onclose = () => console.log("⛔ socket closed");
    return () => ws.close(); // clean‑up on unmount
  }, [url]); // recreate if URL changes

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

// hook to use the socket context
// This will throw an error if used outside of SocketProvider
// Use this hook to access the WebSocket instance
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
