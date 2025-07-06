import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type SocketContextValue = WebSocket | null;
const SocketContext = createContext<SocketContextValue>(null);

export const SocketProvider: React.FC<{ url: string; children: ReactNode }> = ({
  url,
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws); // ← triggers re‑render

    ws.onopen = () => console.log("✅ socket open");
    ws.onerror = (e) => console.error("socket error", e);
    ws.onclose = () => console.log("⛔ socket closed");

    return () => {
      ws.close();
      setSocket(null); // optional: clear on unmount
    };
  }, [url]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
