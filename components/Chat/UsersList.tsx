import { forwardRef, useState } from "react";
import { Conversation, Status } from "@/constants/Data";
import { LoaderPinwheel, Search } from "lucide-react";

type UsersListProps = {
  convos: Conversation[];
  selected: Conversation | null;
  onSelect: (convo: Conversation) => void;
  onSearch: (value: string) => void;
  isFetchingMore: boolean;
  pagination: any;
};

const UsersList = forwardRef<HTMLDivElement, UsersListProps>(
  (
    { convos, selected, onSelect, onSearch, isFetchingMore, pagination },
    ref,
  ) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | Status>("all");

    // ✅ Sirf status filter - search backend se ho raha hai
    const filtered = convos.filter((c) => {
      const matchFilter = filter === "all" || c.status === filter;
      return matchFilter;
    });

    return (
      <div className="bg-white border-r border-gray-100 flex flex-col w-full">
        {/* Header */}
        <div className="px-3 md:px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1a1a2e]">
              Support Inbox
            </h2>
            <span className="bg-[#b026ff] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {pagination?.totalItems}
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">
              <Search size={18} />
            </span>
            <input
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                const trimmedValue = value.trim();
                setSearch(value); // raw value state mein
                onSearch(trimmedValue); // trimmed value backend ko
              }}
              placeholder="Search conversations…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-[13px]"
            />
          </div>
        </div>

        {/* Conversation List */}
        {/* Conversation List */}
        <div ref={ref} className="flex-1 py-4 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-gray-400 text-sm font-medium">
                No conversations found
              </p>
              <p className="text-gray-300 text-xs mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filtered.map((c) => {
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
                      <img
                        src={c.user.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold truncate">
                          {c.user.name}
                        </span>
                        <span className="text-xs text-gray-400">{c.time}</span>
                      </div>

                      <p className="text-xs text-gray-400 truncate flex justify-between">
                        {c.lastMessage}
                        {c.unread > 0 ? (
                          <span className="bg-purple-500 text-xs text-white px-2 py-0.5 rounded-full">
                            {c.unread}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isFetchingMore && (
            <div className="text-center py-10">
              <LoaderPinwheel className="mx-auto animate-spin text-violet-500" />
              <p className="text-gray-400 text-[15px] mt-2">
                Fetching more conversations…
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

UsersList.displayName = "UsersList";
export default UsersList;
