import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { baseURL } from "@/lib/api/axios";

const DEFAULT_URL = baseURL;

interface CreateSocketOptions {
  url?: string;
  token?: string;
}

interface SocketClient {
  socket: Socket;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, ...args: any[]) => void;
}

/**
 * Create a socket.io client with auto-connect disabled and token auth.
 *
 * Strategy:
 * - `auth` object  → sent in the socket.io handshake payload (works for both transports)
 * - `extraHeaders` → only applied to the HTTP polling transport (browsers block WS custom headers)
 */
export function createSocket({ url = DEFAULT_URL, token }: CreateSocketOptions = {}): SocketClient {
  const authToken = token || Cookies.get("token");
  const bearerToken = authToken ? `Bearer ${authToken}` : undefined;

  const socket: Socket = io(url, {
    autoConnect: false,

    // ✅ Prefer polling first so the Authorization header is sent on the initial handshake.
    // After the handshake, socket.io will upgrade to websocket automatically.
    transports: ["polling", "websocket"],

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,

    // ✅ PRIMARY: Sent as JSON body in the socket.io handshake — readable by the server
    // via `socket.handshake.auth.token` regardless of transport.
    auth: {
      token: bearerToken,
    },

    // ✅ SECONDARY: HTTP header — only works on polling transport, not WS upgrade in browsers.
    // Useful if your server middleware reads `req.headers.authorization`.
    transportOptions: {
      polling: {
        extraHeaders: bearerToken
          ? { Authorization: bearerToken }
          : {},
      },
      // ❌ Do NOT set extraHeaders for websocket — browsers silently ignore/block them.
    },
  });

  socket.on("connect", () => console.log("✅ Socket connected"));
  socket.on("connect_error", (err) => console.error("❌ Socket connect error:", err.message));
  socket.on("disconnect", (reason) => console.warn("⚠️ Socket disconnected:", reason));

  return {
    socket,
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    emit: (event: string, ...args: any[]) => {
      if (socket.connected) socket.emit(event, ...args);
    },
  };
}

export default createSocket;