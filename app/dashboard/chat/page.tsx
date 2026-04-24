"use client";

import MainChat from "@/components/Chat/MainChat";
import UsersList from "@/components/Chat/UsersList";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchChatRooms, getMessages } from "@/lib/slices/chatSlice";
import type { Conversation, Message } from "@/constants/Data";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSocket from "@/socket/useSocket";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

const LIMIT = 10;

function updateAndSort(
  prev: Conversation[],
  roomId: string | number,
  lastMessage: string,
  selectedId: string | number | undefined,
  unreadCount?: number,
): Conversation[] {
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const exists = prev.some((c) => String(c.id) === String(roomId));
  if (!exists) return prev;

  const updated = prev.map((c) => {
    if (String(c.id) !== String(roomId)) return c;
    return {
      ...c,
      lastMessage,
      time: now,
      unread: String(selectedId) === String(roomId) ? 0 : (unreadCount ?? c.unread + 1),
    };
  });

  return [
    ...updated.filter((c) => String(c.id) === String(roomId)),
    ...updated.filter((c) => String(c.id) !== String(roomId)),
  ];
}

// ✅ Deleted/unsend messages skip karke last valid message lo
function getLastValidMessage(
  messages: any[],
  roomId: string | number
): string | null {
  const roomMsgs = messages
    .filter((m: any) => String(m.chatRoom) === String(roomId))
    .filter((m: any) => !m.isDeleted && !m.isUnsend)
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return roomMsgs[0]?.content || null;
}

export default function ChatSupport() {
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { listPagination } = useSelector((state: RootState) => state.chat);

  // ✅ Redux messages ref — taake callbacks mein fresh value mile
  const { messages } = useSelector((state: RootState) => state.chat as any);
  const messagesRef = useRef<any[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  const searchRef = useRef("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const selectedIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    selectedIdRef.current = selected?.id;
  }, [selected]);

  const fetchRooms = useCallback(
    async (reset = false) => {
      if (isFetchingRef.current) return;
      if (!reset && !hasMoreRef.current) return;

      isFetchingRef.current = true;
      setIsFetchingMore(true);
      const currentPage = reset ? 1 : pageRef.current;

      try {
        const res: any = await dispatch(
          fetchChatRooms({
            page: currentPage,
            limit: LIMIT,
            search: searchRef.current,
          }),
        );

        const newData = res?.payload?.data || [];
        const mapped: Conversation[] = newData.map((item: any) => {
          const chatRoom = item.chatRoom;
          const otherUser = item.chatUsers.find((u: any) => !u.isSelf);

          // ✅ Backend ka lastMessage deleted/unsend ho sakta hai
          // Agar hai toh "No messages yet" dikhao — baad mein messages load hone pe update hoga
          const rawLastMsg = chatRoom.lastMessage;
          const lastMsgText =
            rawLastMsg && !rawLastMsg.isDeleted && !rawLastMsg.isUnsend
              ? rawLastMsg.content
              : "No messages yet";

          return {
            id: chatRoom.id,
            user: {
              name: otherUser?.user?.fullName || "Unknown",
              avatar: otherUser?.user?.profilePicture,
              email: otherUser?.user?.email || "",
            },
            lastMessage: lastMsgText,
            time: new Date(chatRoom.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unread: chatRoom?.unreadCount || 0,
            status: "open",
            priority: "medium",
            messages: [],
          };
        });

        if (reset) {
          setConvos(mapped);
          pageRef.current = 2;
        } else {
          setConvos((prev) => [...prev, ...mapped]);
          pageRef.current = currentPage + 1;
        }
        hasMoreRef.current = mapped.length >= LIMIT;
      } catch (err) {
        console.error("Failed to fetch chat rooms:", err);
      } finally {
        isFetchingRef.current = false;
        setIsFetchingMore(false);
      }
    },
    [dispatch],
  );

  // ✅ notification socket
  useEffect(() => {
    if (!socket) return;

 const handleNotification = (data: any) => {
  console.log("UPDATED_CHATROOM RAW:", JSON.stringify(data, null, 2));
  
  // Dono possible structures handle karo
  const chatRoom = data?.data?.chatRoom || data?.data;
  const message = data?.data?.message || data?.data;
  
  if (!chatRoom?.id && !chatRoom?._id) return;
  
  const roomId = chatRoom?.id || chatRoom?._id;
  const rawLast = chatRoom?.lastMessage;
  
  const displayMsg =
    rawLast && !rawLast.isDeleted && !rawLast.isUnsend
      ? rawLast.content
      : message?.content && !message?.isDeleted && !message?.isUnsend
      ? message.content
      : "No messages yet";

  setConvos((prev) =>
    updateAndSort(
      prev,
      roomId,
      displayMsg,
      selectedIdRef.current,
      chatRoom?.unreadCount,
    ),
  );
};
    socket.on(SOCKET_EVENTS.CHAT.RECEIVE_USER_LIST, handleNotification);
    socket.on(SOCKET_EVENTS.CHAT.UPDATED_CHATROOM, handleNotification);
    return () => {
      socket.off(SOCKET_EVENTS.CHAT.RECEIVE_USER_LIST, handleNotification);
      socket.off(SOCKET_EVENTS.CHAT.UPDATED_CHATROOM, handleNotification);
    };
  }, [socket]);

  useEffect(() => {
    fetchRooms(true);
  }, [fetchRooms]);

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      if (isFetchingRef.current || !hasMoreRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 80) fetchRooms();
    };
    const ref = listRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, [fetchRooms]);

  const handleSelect = async (convo: Conversation) => {
    socket.emit("joinChatRoom", { id: convo.id });
    await dispatch(getMessages({ roomId: convo.id }));
    setConvos((prev) =>
      prev.map((c) => (c.id === convo.id ? { ...c, unread: 0 } : c)),
    );
    setSelected({ ...convo, unread: 0 });
  };

  const handleSend = (text: string) => {
    if (!selected) return;

    const newMsg: Message = {
      id: Date.now(),
      from: "admin",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConvos((prev) => {
      const withMsg = prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, newMsg] }
          : c,
      );
      return updateAndSort(withMsg, selected.id, text, selectedIdRef.current, 0);
    });

    setSelected((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev,
    );
  };

  // ✅ MainChat se incoming message callback
const handleNewIncomingMessage = useCallback(
  (roomId: string | number, content: string, unreadCount?: number) => {
    setConvos((prev) =>
      updateAndSort(prev, roomId, content, selectedIdRef.current, unreadCount),
    );
  },
  [],
);

  // ✅ Jab bhi messages Redux mein update hon — list ka lastMessage bhi sync karo
  // (delete/unsend ke baad list automatically correct last msg dikhayegi)
useEffect(() => {
  if (messages.length === 0) return;

  setConvos((prev) =>
    prev.map((c) => {
      const hasLoadedMessages = messages.some(
        (m: any) => String(m.chatRoom) === String(c.id)
      );
      if (!hasLoadedMessages) return c;
      
      const lastValid = getLastValidMessage(messages, c.id);
      return { ...c, lastMessage: lastValid ?? "No messages yet" };
    })
  );
}, [messages]);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (value: string) => {
    searchRef.current = value;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      pageRef.current = 1;
      hasMoreRef.current = true;
      fetchRooms(true);
    }, 500);
  };

  const syncedSelected = convos.find((c) => c.id === selected?.id) ?? null;

  return (
    <div className="flex bg-gray-50 overflow-hidden">
      <div
        className={`
          ${selected ? "hidden md:flex" : "flex"}
          w-full md:w-[320px] h-[80vh] lg:w-[350px]
        `}
      >
        <UsersList
          ref={listRef}
          convos={convos}
          selected={syncedSelected}
          onSelect={handleSelect}
          onSearch={handleSearch}
          isFetchingMore={isFetchingMore}
          pagination={listPagination}
        />
      </div>

      <div
        className={`
          ${!selected ? "hidden md:flex" : "flex"}
          flex-1
        `}
      >
        <MainChat
          selected={selected}
          onSend={handleSend}
          onNewMessage={handleNewIncomingMessage}
        />
      </div>
    </div>
  );
}