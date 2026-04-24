"use client";
import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { SOCKET_EVENTS } from "../constants/socketEvents";
import createSocket from "../socket";
import { useDispatch } from "react-redux";

interface CreateSocketOptions {
  url: string;
  token: string;
}

interface SocketClient {
  socket: any; // You can type this more strictly if using socket.io-client
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, payload?: any) => void;
}

interface SocketContextValue {
  socket?: any;
  connect?: () => void;
  disconnect?: () => void;
  emit?: (event: string, payload?: any) => void;
  readChat: (roomId: string) => void;
  joinChatRoom: (chatRoomId: string) => void;
  sendMessage?: (
    payload: SendMessagePayload,
    callback?: (response: AckResponse) => void,
  ) => void; // typed with optional callback
}

export interface SendMessagePayload {
  messageId: string;
  roomId: any;
  content: string;
  type: string;
}

export interface AckResponse {
  success: boolean;
  message?: string;
  data?: any;
}
interface SocketProviderProps {
  children: ReactNode;
  url: string;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  url,
}) => {
  const [client, setClient] = useState<SocketClient | null>(null);
  const [token, setToken] = useState<string | undefined>(
    Cookies.get("authToken"),
  );
  const dispatch = useDispatch();
  console.log(token, "token");
  // Check token changes periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = Cookies.get("authToken");
      if (newToken !== token) {
        setToken(newToken);
      }
    }, 1000); // check every second

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!token) {
      if (client) {
        client.disconnect();
        setClient(null);
      }
      return;
    }

    const { socket, connect, disconnect, emit } = createSocket({
      url,
      token,
    } as CreateSocketOptions);

    setClient({ socket, connect, disconnect, emit });

    connect(); // auto-connect

    // Handle tab visibility
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (socket && !socket.connected) socket.connect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      try {
        disconnect();
      } catch (e) {
        // ignore
      }
    };
  }, [token, url]);

 const value: SocketContextValue = useMemo(
  () => ({
    socket: client?.socket,
    connect: client?.connect,
    disconnect: client?.disconnect,
    emit: client?.emit,

    readChat: (roomId: string) => {
      client?.emit(SOCKET_EVENTS.CHAT.READ, { roomId });
    },

    joinChatRoom: (chatRoomId: string) => {
      client?.emit(SOCKET_EVENTS.CHAT.JOIN_ROOM, { chatRoomId });
    },

    // ✅ socket.emit natively supports (event, payload, callback) — use it directly
    sendMessage: (payload: SendMessagePayload, callback?: (response: AckResponse) => void) => {
      if (!client?.socket?.connected) {
        console.warn("Socket not connected");
        callback?.({ success: false, message: "Socket not connected" });
        return;
      }

      client.socket.emit(
        SOCKET_EVENTS.CHAT.SEND_MESSAGE,
        payload,
        (response: AckResponse) => {
          console.log("ACK from server:", response);
          callback?.(response);
        },
      );
    },
  }),
  [client],
);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
