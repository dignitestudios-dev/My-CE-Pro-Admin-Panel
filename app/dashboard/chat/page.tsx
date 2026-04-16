"use client";

import MainChat from "@/components/Chat/MainChat";
import UsersList from "@/components/Chat/UsersList";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchChatRooms } from "@/lib/slices/chatSlice";
import type { Conversation, Message } from "@/constants/Data";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ChatSupport() {
  const dispatch = useDispatch<AppDispatch>();
  const { chatRooms, loading } = useSelector(
    (state: RootState) => state.chat as any,
  );

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);

  // Fetch chat rooms on mount
  useEffect(() => {
    dispatch(fetchChatRooms({}));
  }, [dispatch]);

  // Map API chatRooms to Conversation whenever chatRooms change
  useEffect(() => {
    const mapped: Conversation[] = chatRooms.map((item: any) => {
      const chatRoom = item.chatRoom;
      const otherUser = item.chatUsers.find((u: any) => !u.isSelf);

      return {
        id: chatRoom.id,
        user: {
          name: otherUser?.user?.fullName || "Unknown",
          avatar: otherUser?.user?.fullName?.charAt(0) || "U",
          email: otherUser?.user?.email || "",
        },
        lastMessage: chatRoom.lastMessage?.content ? chatRoom.lastMessage?.content : "No messages yet",
        time: new Date(chatRoom.updatedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: otherUser?.unreadCount || 0,
        status: "open", // optionally map from API status
        priority: "medium", // optional
        messages: [], // optional: later can populate with message API
      };
    });

    setConvos(mapped);
  }, [chatRooms]);

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

  const syncedSelected = convos.find((c) => c.id === selected?.id) ?? null;

  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      {/* 🟣 Sidebar */}
      <div
        className={`
      ${selected ? "hidden md:flex" : "flex"}
      w-full md:w-[320px] lg:w-[350px]
    `}
      >
        <UsersList
          convos={convos}
          selected={syncedSelected}
          onSelect={handleSelect}
        />
      </div>

      {/* 🟢 Chat */}
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
