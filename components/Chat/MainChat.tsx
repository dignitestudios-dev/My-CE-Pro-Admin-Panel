import { Conversation, statusConfig } from "@/constants/Data";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

type MainChatProps = {
  selected: Conversation | null;
  onSend: (text: string) => void;
};

export default function MainChat({ selected, onSend }: MainChatProps) {
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
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
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gray-400 text-sm font-medium">
            Select a conversation to begin
          </p>
        </div>
      </div>
    );
  }

  const status = statusConfig[selected.status];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d580ff] to-[#b026ff] flex items-center justify-center text-white text-[13px] font-bold ring-2 ring-white ring-offset-1 ring-offset-[#d580ff]/30 shadow">
            {selected.user.avatar}
          </div>

          {/* Name & Email */}
          <div>
            <p className="text-[15px] font-bold text-[#1a1a2e] leading-tight">
              {selected.user.name}
            </p>
            <p className="text-[12px] text-gray-400">{selected.user.email}</p>
          </div>

          {/* Status Badge */}
          {/* <span
            className={`ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
          </span> */}
        </div>

        {/* Actions */}
        {/* <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-[#b026ff] text-white text-[12px] font-semibold hover:bg-[#9500e0] transition">
            ✓ Resolve
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-400 text-[12px] font-semibold hover:bg-gray-50 transition">
            ⊘ Close
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-400 text-[12px] font-semibold hover:bg-gray-50 transition">
            ⋯
          </button>
        </div> */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="text-center">
            <span className="text-[11px] text-gray-400 bg-gray-200 px-3 py-0.5 rounded-full">
              Today
            </span>
          </div>
          {selected.messages.map((msg) => {
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
                    {selected.user.avatar}
                  </div>
                )}

                <div className="max-w-[65%]">
                  <div
                    className={`px-3.5 py-2.5 text-[13px] leading-relaxed
                    ${
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
                    {msg.time}
                    {isAdmin && " · You"}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 flex-shrink-0">
        <style>{`@keyframes slideIn { 
          from { opacity:0; transform:translateY(6px); } 
          to { opacity:1; transform:translateY(0); } 
        }`}</style>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5 focus-within:border-[#b026ff]/40 focus-within:ring-2 focus-within:ring-[#b026ff]/10 transition">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Reply to ${selected.user.name.split(" ")[0]}…`}
              className="flex-1 bg-transparent border-none text-[13px] text-[#1a1a2e] placeholder-gray-400 resize-none leading-relaxed focus:outline-none max-h-[120px] overflow-y-auto"
            />

            <div className="flex gap-1.5 flex-shrink-0 items-center">
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
    </div>
  );
}
