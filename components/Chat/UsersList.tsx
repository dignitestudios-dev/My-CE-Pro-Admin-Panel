import { forwardRef, useState } from "react";
import { Conversation, Status } from "@/constants/Data";
import { Search } from "lucide-react";

type UsersListProps = {
  convos: Conversation[];
  selected: Conversation | null;
  onSelect: (convo: Conversation) => void;
  onSearch: (value: string) => void;
  isFetchingMore: boolean;
};

const UsersList = forwardRef<HTMLDivElement, UsersListProps>(
  ({ convos, selected, onSelect, onSearch, isFetchingMore }, ref) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | Status>("all");

    const totalUnread = convos.reduce((acc, c) => acc + c.unread, 0);

    const filtered = convos.filter((c) => {
      const matchFilter = filter === "all" || c.status === filter;
      return matchFilter;
    });

    return (
      <div className="bg-white border-r border-gray-100 flex flex-col w-full">
        {/* Header */}
        <div className="px-3 md:px-4">
          <div className="flex items-center justify-between ">
            <h2 className="text-base font-bold text-[#1a1a2e]">
              Support Inbox
            </h2>

            {totalUnread > 0 && (
              <span className="bg-[#b026ff] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {totalUnread} new
              </span>
            )}
          </div>

          {/* Search */}
          {/* <div className="relative mb-3">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">
              <Search size={18} />
            </span>

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch(e.target.value);
              }}
              placeholder="Search conversations…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-[13px]"
            />
          </div> */}
        </div>

        {/* Conversation List */}
        <div ref={ref} className="flex-1 py-4 overflow-y-auto">
          {filtered.map((c) => {
            const isActive = selected?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => onSelect(c)}
                className={`py-3 px-3 border-b cursor-pointer ${
                  isActive ? "bg-violet-50" : "hover:bg-violet-50/50"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    {c.user.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold truncate">
                        {c.user.name}
                      </span>
                      <span className="text-xs text-gray-400">{c.time}</span>
                    </div>

                    <p className="text-xs text-gray-400 truncate">
                      {c.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom Loader */}
          {isFetchingMore && (
            <div className="text-center py-3 text-gray-400 text-sm">
              Loading more...
            </div>
          )}
        </div>
      </div>
    );
  }
);

UsersList.displayName = "UsersList";
export default UsersList;