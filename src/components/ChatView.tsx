import { useAppStore } from "@/stores/useAppStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { MessageSquare } from "lucide-react";

export default function ChatView() {
  const { sessions, currentSessionId } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const session = sessions.find((s) => s.id === currentSessionId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages.length]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary text-lg">Select a session to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-full">
      <ChatHeader />

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {session.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <p className="text-text-secondary text-lg font-medium">Start a New Chat</p>
              <p className="text-text-tertiary text-sm mt-1">Type a message or send an image to begin</p>
            </div>
          </div>
        ) : (
          session.messages.map((message) => (
            <MessageBubble key={message.id} messageId={message.id} sessionId={session.id} />
          ))
        )}
      </div>

      <ChatInput />
    </div>
  );
}
