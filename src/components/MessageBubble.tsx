import { useAppStore } from "@/stores/useAppStore";
import { User, Bot } from "lucide-react";

interface MessageBubbleProps {
  messageId: string;
  sessionId: string;
}

export default function MessageBubble({ messageId, sessionId }: MessageBubbleProps) {
  const { sessions } = useAppStore();
  const session = sessions.find((s) => s.id === sessionId);
  const message = session?.messages.find((m) => m.id === messageId);

  if (!message) return null;

  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary/20" : "bg-success/20"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary" />
        ) : (
          <Bot className="w-4 h-4 text-success" />
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        {/* Image */}
        {message.content.imageData && (
          <div className="mb-2 rounded-2xl overflow-hidden border border-border">
            <img
              src={message.content.imageData}
              alt="Uploaded"
              className="max-w-[250px] max-h-[250px] object-cover"
            />
          </div>
        )}

        {/* Text */}
        {message.content.text && (
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-user-bubble text-text rounded-tr-sm"
                : "bg-assistant-bubble text-text rounded-tl-sm"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content.text}</p>
          </div>
        )}

        {/* Streaming indicator */}
        {message.isStreaming && (
          <div className="flex items-center gap-1.5 mt-2 px-1">
            <div className="w-2 h-2 rounded-full bg-text-secondary animate-pulse-dot" />
            <div className="w-2 h-2 rounded-full bg-text-secondary animate-pulse-dot-delay-1" />
            <div className="w-2 h-2 rounded-full bg-text-secondary animate-pulse-dot-delay-2" />
          </div>
        )}
      </div>
    </div>
  );
}
