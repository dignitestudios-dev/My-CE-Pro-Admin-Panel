export type Message = {
  id: number | string;
  from: "admin" | "user";
  text: string | null;
  isDeleted?: boolean;
  isEdited?: boolean;
  replyTo?: string | null; // ✅ naya
  createdAt?: string;
  time: string;
};

export type User = {
    name: string;
    avatar: string;
    email: string;
};

export type Status = "open" | "resolved" | "pending";
export type Priority = "high" | "medium" | "low";

export type Conversation = {
    id: number;
    user: User;
    lastMessage: string;
    time: string;
    unread: number;
    status: Status;
    priority: Priority;
    messages: Message[];
};

export const conversations: Conversation[] = [
    {
        id: 1,
        user: { name: "Sarah Mitchell", avatar: "SM", email: "sarah@example.com" },
        lastMessage: "I can't seem to reset my password, it keeps saying invalid token",
        time: "2m ago",
        unread: 3,
        status: "open",
        priority: "high",
        messages: [
            { id: 1, from: "user", text: "Hi, I need help with my account", time: "10:14 AM" },
            { id: 2, from: "admin", text: "Hello Sarah! I'd be happy to help you. What seems to be the issue?", time: "10:15 AM" },
            { id: 3, from: "user", text: "I can't seem to reset my password, it keeps saying invalid token", time: "10:17 AM" },
        ],
    },
    {
        id: 2,
        user: { name: "James Okoye", avatar: "JO", email: "james@example.com" },
        lastMessage: "The billing section shows an error when I try to update my card",
        time: "15m ago",
        unread: 1,
        status: "open",
        priority: "medium",
        messages: [
            { id: 1, from: "user", text: "Hello, I have a billing issue", time: "9:50 AM" },
            { id: 2, from: "user", text: "The billing section shows an error when I try to update my card", time: "9:51 AM" },
        ],
    },
    {
        id: 3,
        user: { name: "Priya Sharma", avatar: "PS", email: "priya@example.com" },
        lastMessage: "Thank you so much! That fixed it perfectly.",
        time: "1h ago",
        unread: 0,
        status: "resolved",
        priority: "low",
        messages: [
            { id: 1, from: "user", text: "My notifications aren't working", time: "8:30 AM" },
            { id: 2, from: "admin", text: "I've checked your account settings. Please toggle notifications off and on again in your profile.", time: "8:35 AM" },
            { id: 3, from: "user", text: "Thank you so much! That fixed it perfectly.", time: "8:40 AM" },
        ],
    },
    {
        id: 4,
        user: { name: "Carlos Vega", avatar: "CV", email: "carlos@example.com" },
        lastMessage: "When will the new features be available?",
        time: "3h ago",
        unread: 0,
        status: "pending",
        priority: "low",
        messages: [
            { id: 1, from: "user", text: "When will the new features be available?", time: "7:10 AM" },
        ],
    },
    {
        id: 5,
        user: { name: "Emily Tan", avatar: "ET", email: "emily@example.com" },
        lastMessage: "I'm getting a 403 error on the API endpoint",
        time: "5h ago",
        unread: 2,
        status: "open",
        priority: "high",
        messages: [
            { id: 1, from: "user", text: "I'm getting a 403 error on the API endpoint", time: "5:00 AM" },
            { id: 2, from: "user", text: "It was working fine yesterday", time: "5:01 AM" },
        ],
    },
];

export type StatusConfig = {
    bg: string;
    text: string;
    dot: string;
};

export const statusConfig: Record<Status, StatusConfig> = {
    open: { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-500" },
    resolved: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
};

export type PriorityConfig = {
    label: string;
    color: string;
};

export const priorityConfig: Record<Priority, PriorityConfig> = {
    high: { label: "● HIGH", color: "text-rose-500" },
    medium: { label: "● MED", color: "text-amber-500" },
    low: { label: "● LOW", color: "text-slate-400" },
};