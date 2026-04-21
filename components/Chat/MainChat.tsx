import { Conversation, statusConfig, Message } from "@/constants/Data";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import SocketContext, {
  AckResponse,
  SendMessagePayload,
} from "@/contexts/SocketContext";
import { addMessage, getMessages } from "@/lib/slices/chatSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { MessageCircleMore } from "lucide-react";
import { useState, useRef, useEffect, KeyboardEvent, useContext ,useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

type MainChatProps = {
  selected: Conversation | null;
  onSend: (text: string) => void;
};

export default function MainChat({ selected, onSend }: MainChatProps) {
  const [input, setInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketContext = useContext(SocketContext);
  const { socket, sendMessage, readChat } = socketContext || {};
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((state: RootState) => state.chat as any);
  const { user } = useSelector((state: RootState) => state.auth as any);
  const [isLoading,setIsLoading]=useState(false);
  // Fetch messages whenever selected chat changes
const fetchMsg = useCallback(async () => {
  if (!selected) return;

  const alreadyLoaded = messages.some(
    (m: any) => m.chatRoom === selected.id
  );

  if (alreadyLoaded) return;

  setIsLoading(true);
  await dispatch(getMessages({ roomId: selected.id }));
  setIsLoading(false);
}, [selected, dispatch, messages]);

  useEffect(() => {
  fetchMsg();
}, [selected]);

  // Sync Redux messages to local state
  useEffect(() => {
    if (!selected) return;

    const msgsForRoom = (messages as any)
      .filter((m: any) => m.chatRoom === selected.id)
      .map((m: any) => ({
        id: m._id,
        from: m.sender == user?._id ? "admin" : "user",
        text: m.content,
        createdAt: m.createdAt, // ✅ add this
        time: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
    const sortedMsgs = msgsForRoom.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    setChatMessages(sortedMsgs);
  }, [messages, selected]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: any) => {
      console.log("📩 New Message:", data?.data?.message);
      dispatch(addMessage(data?.data?.message));
      // dispatch(getChatRooms({ page: 1, limit: 20, type: isActiveTab }));
    };

    const handleSendError = (error: any) => {
      console.error("❌ Chat send error:", error);
    };

    const handleUnreadCount = () => {
      // dispatch(getChatRooms({ page: 1, limit: 20, type: isActiveTab }));
    };

    socket.on(SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.on("socketError", handleSendError); // if backend sends this
    socket.on("chat:unread:count", handleUnreadCount);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.off("socketError", handleSendError);
      socket.off("chat:unread:count", handleUnreadCount);
    };
  }, [socket, dispatch]);

  const handleSend = () => {
    if (!input.trim() || !selected || !sendMessage) return;

    const messagePayload: SendMessagePayload = {
      messageId: crypto.randomUUID(), // ✅ use unique IDs, not hardcoded "1234"
      roomId: selected.id,
      content: input.trim(),
      type: "text",
    };

    onSend(input.trim()); // optimistic UI

    // ✅ No more TS error — callback is typed as optional second argument
    sendMessage(messagePayload, (ack: AckResponse) => {
      if (ack?.success) {
         dispatch(addMessage(ack?.data?.message));
        console.log("Message delivered ✅",ack);
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
          <div className="text-4xl mb-3"><MessageCircleMore size={25} className="mx-auto text-gray-500 " /></div>
          <p className="text-gray-400 text-sm font-medium">
            Select a conversation to begin
          </p>
        </div>
      </div>
    );
  }

  const status = statusConfig[selected.status];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0 h-[calc(100vh-120px)]">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center gap-3">
        {/* 🔙 Mobile Back */}
        <button
          onClick={() => window.history.back()} // ya custom setSelected(null)
          className="md:hidden text-xl"
        >
          ←
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d580ff] to-[#b026ff] flex items-center justify-center text-white text-[13px] font-bold">
          <img src={selected.user.avatar} alt={selected.user.name} className="w-full h-full rounded-full object-cover" />
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
      <div className="flex-1 overflow-y-auto px-3 md:px-6 ">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="text-center my-2">
            <span className="text-[11px] text-gray-400 bg-gray-200 px-3 py-0.5 rounded-full">
              Today
            </span>
          </div>

         {isLoading ? (
  <div className="flex flex-col gap-3 mt-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse"></div>

        <div className="max-w-[85%] md:max-w-[65%]">
          <div className="h-10 w-40 bg-gray-300 rounded-2xl rounded-bl-sm animate-pulse"></div>
          <div className="h-2 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
) : (
  chatMessages.map((msg) => {
    console.log(msg,"messages")
    const isAdmin = msg.from === "admin";
    return (
      <div
        key={msg.id}
        className={`flex items-end gap-2 ${
          isAdmin ? "flex-row-reverse" : "flex-row"
        }`}
        style={{ animation: "slideIn 0.2s ease" }}
      >
        {!isAdmin && (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d580ff] to-[#b026ff] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
           <img src={selected.user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
          </div>
        )}

        <div className="max-w-[85%] md:max-w-[65%]">
          <div
            className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
              isAdmin
                ? "bg-gradient-to-br from-[#b026ff] to-[#7c00cc] text-white rounded-2xl rounded-br-sm shadow-[0_2px_12px_rgba(176,38,255,0.25)]"
                : "bg-white text-[#1a1a2e] rounded-2xl rounded-bl-sm shadow-sm"
            }`}
          >
            {msg.text}
          </div>

          <p
            className={`text-[10px] text-gray-400 mt-1 ${
              isAdmin ? "text-right" : "text-left"
            }`}
          >
            {msg.time} {isAdmin && "· You"}
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
          <div className="flex items-end gap-2 border rounded-2xl px-3 py-2  bg-gray-50  border-gray-200    focus-within:border-[#b026ff]/40 focus-within:ring-2 focus-within:ring-[#b026ff]/10 transition">
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
