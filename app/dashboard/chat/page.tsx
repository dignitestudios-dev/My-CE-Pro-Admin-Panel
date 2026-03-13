"use client";
import MainChat from "@/components/Chat/MainChat";
import UsersList from "@/components/Chat/UsersList";
import { conversations } from "@/constants/Data";
import type { Conversation, Message } from "@/constants/Data";
import { useState } from "react";

export default function ChatSupport() {
  const [convos, setConvos] = useState<Conversation[]>(conversations);
  const [selected, setSelected] = useState<Conversation | null>(
    conversations[0] || null,
  );

  const handleSelect = (convo: Conversation) => {
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
    <div className="flex bg-gray-50">
      <UsersList
        convos={convos}
        selected={syncedSelected}
        onSelect={handleSelect}
      />

      <MainChat selected={syncedSelected} onSend={handleSend} />
    </div>
  );
}
