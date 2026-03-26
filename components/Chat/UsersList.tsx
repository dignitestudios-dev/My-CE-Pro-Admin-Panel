import {
  Conversation,
  priorityConfig,
  Status,
  statusConfig,
} from "@/constants/Data";
import { fetchChatRooms } from "@/lib/slices/chatSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type UsersListProps = {
  convos: Conversation[];
  selected: Conversation | null;
  onSelect: (convo: Conversation) => void;
};

export default function UsersList({
  convos,
  selected,
  onSelect,
}: UsersListProps) {
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | Status>("all");


  
  const totalUnread = convos.reduce((acc, c) => acc + c.unread, 0);

  const filtered = convos.filter((c) => {
    const matchSearch =
      c.user.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "all" || c.status === filter;

    return matchSearch && matchFilter;
  });

  console.log(filtered,"messages")

  return (
    <div className="bg-white border-r border-gray-100 flex flex-col w-full">
      {/* Header */}
      <div className="border-b pb-3 px-3 md:px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#1a1a2e]">Support Inbox</h2>

          {totalUnread > 0 && (
            <span className="bg-[#b026ff] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {totalUnread} new
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">
            <Search size={18}   />
          </span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-[13px] text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b026ff]/20 focus:border-[#b026ff]/40 transition"
          />
        </div>

        {/* Filter Pills */}
        {/* <div className="flex gap-1.5 flex-wrap">
          {(["all", "open", "pending", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] font-medium px-3 py-1 rounded-full border transition capitalize
                ${
                  filter === f
                    ? "bg-[#b026ff] text-white border-[#b026ff]"
                    : "bg-transparent text-gray-400 border-gray-200 hover:bg-violet-50"
                }`}
            >
              {f}
            </button>
          ))}
        </div> */}
      </div>

      {/* Conversation List */}
<div className="flex-1 py-4 overflow-y-auto">
  {filtered.length === 0 ? (
    <div className="flex items-center justify-center h-full text-sm text-gray-400">
      No users found
    </div>
  ) : (
    filtered.map((c) => {
      const isActive = selected?.id === c.id;
      return (
        <div
          key={c.id}
          onClick={() => onSelect(c)}
          className={`py-2.5 md:py-3 px-3 border-b border-gray-100 cursor-pointer transition-colors
            ${isActive ? "bg-violet-50" : "hover:bg-violet-50/50"}`}
        >
          <div className="flex items-start gap-2.5">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d580ff] to-[#b026ff] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm">
              {c.user.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[13px] font-semibold text-[#1a1a2e] truncate">
                  {c.user.name}
                </span>

                <span className="text-[11px] text-gray-400 flex-shrink-0 ml-1">
                  {c.time}
                </span>
              </div>

              <p className="text-[12px] text-gray-400 truncate mb-1.5">
                {c.lastMessage}
              </p>
            </div>
          </div>
        </div>
      );
    })
  )}
</div>
    </div>
  );
}
