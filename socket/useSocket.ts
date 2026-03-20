import SocketContext from "@/contexts/SocketContext";
import { useContext, useEffect, useRef, useCallback } from "react";

interface SocketContextType {
  socket: any;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, ...args: any[]) => void;
}

interface Handler {
  event: string;
  handler: (...args: any[]) => void;
}

export default function useSocket() {
  const ctx = useContext(SocketContext) as SocketContextType | null;

  const handlersRef = useRef<Handler[]>([]);

  if (!ctx) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  const { socket, connect, disconnect, emit } = ctx;

  /**
   * Subscribe to a socket event with auto cleanup
   */
  const on = useCallback(
    (event: string, handler: (...args: any[]) => void) => {
      if (!socket) return () => {};
      socket.on(event, handler);

      // Store handler reference for cleanup
      handlersRef.current.push({ event, handler });

      // Return unsubscribe function
      return () => {
        socket.off(event, handler);
        handlersRef.current = handlersRef.current.filter(
          (h) => h.event !== event || h.handler !== handler
        );
      };
    },
    [socket]
  );

  // Cleanup all handlers on unmount or socket change
  useEffect(() => {
    return () => {
      handlersRef.current.forEach(({ event, handler }) =>
        socket?.off(event, handler)
      );
      handlersRef.current = [];
    };
  }, [socket]);

  return {
    socket,
    connect,
    disconnect,
    emit,
    on,
  };
}