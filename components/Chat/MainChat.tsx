import { Conversation, Message } from "@/constants/Data";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import SocketContext, {
  AckResponse,
  SendMessagePayload,
} from "@/contexts/SocketContext";
import { addMessage, updateMessage, getMessages } from "@/lib/slices/chatSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { MessageCircleMore } from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useContext,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";

type MainChatProps = {
  selected: Conversation | null;
  onSend: (text: string) => void;
  onNewMessage: (
    roomId: string | number,
    content: string,
    unreadCount?: number,
  ) => void;
};

export default function MainChat({
  selected,
  onSend,
  onNewMessage,
}: MainChatProps) {
  const [input, setInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const socketContext = useContext(SocketContext);
  const { socket, sendMessage } = socketContext || {};
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((state: RootState) => state.chat as any);
  const { user } = useSelector((state: RootState) => state.auth as any);

  // ✅ Fresh selected value socket handlers ke liye
  const selectedRef = useRef<Conversation | null>(null);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // ✅ replyTo id se original message dhundo
  const getReplyMessage = useCallback(
    (replyToId: string) => {
      return messages.find((m: any) => m._id === replyToId) || null;
    },
    [messages],
  );

  const scrollToMessage = (messageId: string) => {
    const el = messageRefs.current[messageId];
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      setHighlightedId(messageId);

      setTimeout(() => {
        setHighlightedId(null);
      }, 2000);
    }, 300);
  };
  // ✅ Messages fetch — sirf tab jab is room ke messages load nahi hue
  const fetchMsg = useCallback(async () => {
    if (!selected) return;

    const loadedForRoom = messages.filter(
      (m: any) => m.chatRoom === selected.id,
    );
    if (loadedForRoom.length > 0) return;

    setIsLoading(true);
    await dispatch(getMessages({ roomId: selected.id }));
    setIsLoading(false);
  }, [selected, dispatch, messages]);

  useEffect(() => {
    fetchMsg();
  }, [selected]);

  // ✅ Redux messages → local chatMessages sync
  useEffect(() => {
    if (!selected) return;

    const msgsForRoom = (messages as any[])
      .filter((m: any) => m.chatRoom === selected.id)
      .filter((m: any) => !m.isUnsend)
      .map((m: any) => ({
        id: m._id,
        from: (m.sender === user?._id ? "admin" : "user") as "admin" | "user",
        text: m.isDeleted ? null : m.content,
        isDeleted: m.isDeleted || false,
        isEdited: m.isEdited || false,
        replyTo: m.replyTo || null,
        createdAt: m.createdAt,
        time: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
      .sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    setChatMessages(msgsForRoom);
  }, [messages, selected]);

  // ✅ Naya message aaye toh scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ✅ Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: any) => {
      const message = data?.data?.message || data?.data || data;
      if (!message) return;
      if (message.isUnsend) return;

      if (message.isDeleted) {
        dispatch(updateMessage({ ...message, isDeleted: true }));
        return;
      }

      dispatch(addMessage(message));

      const roomId = message.chatRoom;
      const content = message.content;
      const isCurrentRoom = selectedRef.current?.id === roomId;

      onNewMessage(roomId, content, isCurrentRoom ? 0 : undefined);
    };

    const handleDeleteMessage = (data: any) => {
      const message = data?.data?.message || data?.data || data;
      if (!message?._id) return;
      dispatch(updateMessage({ ...message, isDeleted: true }));
    };

    const handleEditMessage = (data: any) => {
      const message = data?.data?.message || data?.data || data;
      if (!message?._id) return;
      dispatch(updateMessage({ ...message }));
    };

    socket.on(SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.on(SOCKET_EVENTS.CHAT.DELETE_MESSAGE, handleDeleteMessage);
    socket.on(SOCKET_EVENTS.CHAT.UPDATED_CHATROOM, handleReceiveMessage);
    socket.on(SOCKET_EVENTS.CHAT.EDIT_MESSAGE, handleEditMessage);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.off(SOCKET_EVENTS.CHAT.DELETE_MESSAGE, handleDeleteMessage);
      socket.off(SOCKET_EVENTS.CHAT.UPDATED_CHATROOM, handleReceiveMessage);
      socket.off(SOCKET_EVENTS.CHAT.EDIT_MESSAGE, handleEditMessage);
    };
  }, [socket, dispatch, onNewMessage]);

  const handleSend = () => {
    if (!input.trim() || !selected || !sendMessage) return;

    const messagePayload: SendMessagePayload = {
      messageId: crypto.randomUUID(),
      roomId: selected.id,
      content: input.trim(),
      type: "text",
    };

    onSend(input.trim());

    sendMessage(messagePayload, (ack: AckResponse) => {
      if (ack?.success) {
        dispatch(addMessage(ack?.data?.message));
      } else {
        console.error("Message failed ❌", ack?.message);
      }
    });

    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircleMore size={25} className="mx-auto text-gray-500" />
          <p className="text-gray-400 text-sm font-medium mt-3">
            Select a conversation to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0 h-[calc(100vh-120px)]">
      {/* Highlight animation */}
      <style>{`
        @keyframes highlightFade {
          0%   { background-color: rgba(176, 38, 255, 0.25); }
          100% { background-color: transparent; }
        }
        .highlight-msg {
          animation: highlightFade 1.5s ease forwards;
          border-radius: 12px;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="md:hidden text-xl"
        >
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d580ff] to-[#b026ff] flex items-center justify-center text-white text-[13px] font-bold">
          <img
            src={selected.user.avatar}
            alt={selected.user.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-[14px] md:text-[15px] font-bold text-[#1a1a2e]">
            {selected.user.name}
          </p>
          <p className="text-[11px] md:text-[12px] text-gray-400">
            {selected.user.email}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="text-center my-2">
            <span className="text-[11px] text-gray-400 bg-gray-200 px-3 py-0.5 rounded-full">
              Today
            </span>
          </div>

          {/* Loading skeleton */}
          {isLoading ? (
            <div className="flex flex-col gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse" />
                  <div className="max-w-[85%] md:max-w-[65%]">
                    <div className="h-10 w-40 bg-gray-300 rounded-2xl rounded-bl-sm animate-pulse" />
                    <div className="h-2 w-16 bg-gray-200 rounded mt-2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            chatMessages.map((msg) => {
              const isAdmin = msg.from === "admin";
              const replied = msg.replyTo ? getReplyMessage(msg.replyTo) : null;

              return (
                <div
                  key={msg.id}
                  ref={(el) => {
                    messageRefs.current[msg.id as string] = el;
                  }}
                  className={`flex items-end gap-2 my-1 ${
                    isAdmin ? "flex-row-reverse" : "flex-row"
                  } transition-all duration-300 `}
                  style={{ animation: "slideIn 0.2s ease" }}
                >
                  {/* User avatar */}
                  {!isAdmin && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d580ff] to-[#b026ff] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      <img
                        src={selected.user.avatar}
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`max-w-[85%] md:max-w-[65%] `}>

                    
                   

                  
               <div
  className={`px-3.5 py-2.5 text-[13px] leading-relaxed rounded-2xl transition-all ${
    isAdmin
      ? "bg-gradient-to-br from-[#b026ff] to-[#7c00cc] text-white rounded-br-sm shadow-[0_2px_12px_rgba(176,38,255,0.25)]"
      : "bg-white text-[#1a1a2e] rounded-bl-sm shadow-sm"
  } ${
    highlightedId === msg.id ? "ring-2 ring-green-400 bg-green-200/30" : ""
  }`}
>
                      {replied && (
                      <div
                        onClick={() => scrollToMessage(replied._id)}
                        className={`cursor-pointer text-[11px] px-2.5 py-1.5 mb-1 rounded-xl border-l-2 opacity-70 hover:opacity-100 transition-opacity ${
                          isAdmin
                            ? "bg-[#9609f4] border-white/50 text-white"
                            : "bg-gray-100 border-gray-400 text-gray-600"
                        }`}
                      >
                        <p className="font-semibold text-[8px] mb-0.5">
                          {replied.sender === user?._id
                            ? "You"
                            : selected.user.name}
                        </p>
                        <p className="truncate text-[12px]">
                          {replied.isDeleted
                            ? "🚫 Deleted message"
                            : replied.content}
                        </p>
                      </div>
                    )}
                      {msg.isDeleted ? (
                        <span
                          className={`flex items-center gap-1.5 italic text-[12px] ${
                            isAdmin ? "opacity-70" : "opacity-50"
                          }`}
                        >
                          🚫 This message was deleted
                        </span>
                      ) : (
                        

                          msg.text
                     
                      )}
                    </div>

                    {/* Time + edited */}
                    <p
                      className={`text-[10px] text-gray-400 mt-1 ${
                        isAdmin ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.time} {isAdmin && "· You"}
                      {msg.isEdited && (
                        <span className="italic text-xs ml-1">· edited</span>
                      )}
                    </p>
                  </div>
                  
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-3 md:px-6 py-3 md:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 border rounded-2xl px-3 py-2 bg-gray-50 border-gray-200 focus-within:border-[#b026ff]/40 focus-within:ring-2 focus-within:ring-[#b026ff]/10 transition">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Reply to ${selected.user.name.split(" ")[0]}…`}
              className="flex-1 bg-transparent border-none text-[13px] text-[#1a1a2e] placeholder-gray-400 resize-none leading-relaxed focus:outline-none max-h-[120px] overflow-y-auto"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b026ff] to-[#7c00cc] text-white flex items-center justify-center text-base shadow-[0_2px_10px_rgba(176,38,255,0.35)] hover:scale-105 active:scale-95 transition-transform"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}