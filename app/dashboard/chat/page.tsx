"use client";

import MainChat from "@/components/Chat/MainChat";
import UsersList from "@/components/Chat/UsersList";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchChatRooms } from "@/lib/slices/chatSlice";
import type { Conversation, Message } from "@/constants/Data";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const LIMIT = 10;

export default function ChatSupport() {
  const dispatch = useDispatch<AppDispatch>();

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [search, setSearch] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // ✅ Use refs to avoid stale closures in scroll handler
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  const searchRef = useRef("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const fetchRooms = useCallback(
    async (reset = false) => {
      // ✅ Guard against concurrent fetches using ref (not state)
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

          return {
            id: String(chatRoom._id || chatRoom.id),
            user: {
              name: String(otherUser?.user?.fullName || "Unknown"),
              avatar: String(otherUser?.user?.fullName?.charAt(0) || "U"),
              email: String(otherUser?.user?.email || ""),
            },
            lastMessage: String(chatRoom.lastMessage?.content || "No messages yet"),
            time: new Date(chatRoom.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unread: Number(otherUser?.unreadCount || 0),
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

        // ✅ hasMore check matches the actual limit
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

  // Initial load
  useEffect(() => {
    fetchRooms(true);
  }, [fetchRooms]);

  // ✅ Scroll handler reads from refs — no stale closure issues
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      if (isFetchingRef.current || !hasMoreRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 80;

      if (nearBottom) {
        fetchRooms();
      }
    };

    const ref = listRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, [fetchRooms]); // fetchRooms is stable due to useCallback with no deps

  const handleSelect = (convo: Conversation) => {
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

    setConvos((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: text,
              time: "just now",
            }
          : c,
      ),
    );

    setSelected((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev,
    );
  };

  // ✅ Debounced search handler
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (value: string) => {
    setSearch(value);
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
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          ${selected ? "hidden md:flex" : "flex"}
          w-full md:w-[320px] lg:w-[350px]
        `}
      >
        <UsersList
          ref={listRef}
          convos={convos}
          selected={syncedSelected}
          onSelect={handleSelect}
          onSearch={handleSearch}
          isFetchingMore={isFetchingMore}
        />
      </div>

      {/* Chat */}
      <div
        className={`
          ${!selected ? "hidden md:flex" : "flex"}
          flex-1
        `}
      >
        <MainChat selected={selected} onSend={handleSend} />
      </div>
    </div>
  );
}
