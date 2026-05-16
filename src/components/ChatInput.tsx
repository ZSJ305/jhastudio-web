import { useAppStore } from "@/stores/useAppStore";
import { ImagePlus, Send, X } from "lucide-react";
import { useState, useRef } from "react";

export default function ChatInput() {
  const { currentSessionId, addMessage, updateMessage, setIsGenerating, selectedModelId, selectedAPIId } = useAppStore();
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!currentSessionId || (!inputText.trim() && !selectedImage)) return;

    const text = inputText.trim() || (selectedImage ? "Describe this image" : "");
    const messageId = Math.random().toString(36).substring(2, 15);

    // Add user message
    addMessage(currentSessionId, {
      id: messageId,
      role: "user",
      content: {
        text,
        imageData: selectedImage || undefined,
      },
      timestamp: new Date(),
      isStreaming: false,
    });

    setInputText("");
    setSelectedImage(null);

    // Simulate assistant response
    simulateResponse();
  };

  const simulateResponse = () => {
    if (!currentSessionId) return;
    setIsGenerating(true);

    const responseId = Math.random().toString(36).substring(2, 15);
    const responses = [
      "That's an interesting question! Let me explain in detail...",
      "Based on my understanding, there are several key points: first...",
      "Sure, let me help you analyze this situation...",
      "That's a great observation! Actually...",
    ];
    const fullResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add initial empty assistant message
    addMessage(currentSessionId, {
      id: responseId,
      role: "assistant",
      content: { text: "" },
      timestamp: new Date(),
      isStreaming: true,
    });

    // Stream characters
    let currentText = "";
    const chars = fullResponse.split("");
    let index = 0;

    const interval = setInterval(() => {
      if (index < chars.length) {
        currentText += chars[index];
        updateMessage(currentSessionId, responseId, {
          content: { text: currentText },
        });
        index++;
      } else {
        clearInterval(interval);
        updateMessage(currentSessionId, responseId, {
          isStreaming: false,
          content: { text: currentText },
        });
        setIsGenerating(false);
      }
    }, 50);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = inputText.trim() || selectedImage;
  const hasSelection = selectedModelId || selectedAPIId;

  return (
    <div className="glass border-t border-border p-4">
      {/* Selected image preview */}
      {selectedImage && (
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-16 h-16 object-cover rounded-xl border border-border"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors"
            >
              <X className="w-3 h-3 text-text-secondary" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Image upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl hover:bg-surface-hover transition-colors shrink-0"
        >
          <ImagePlus className="w-5 h-5 text-primary" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasSelection ? "Type a message..." : "Please select a model or API first"}
            disabled={!hasSelection}
            rows={1}
            className="w-full px-4 py-3 bg-surface border border-border rounded-2xl text-sm text-text placeholder:text-text-tertiary resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend || !hasSelection}
          className={`p-2.5 rounded-xl transition-all shrink-0 ${
            canSend && hasSelection
              ? "bg-primary hover:bg-primary-hover text-white"
              : "bg-surface-hover text-text-tertiary cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
