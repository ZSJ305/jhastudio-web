import { useAppStore } from "@/stores/useAppStore";
import Sidebar from "@/components/Sidebar";
import ChatView from "@/components/ChatView";
import ModelManagementView from "@/components/ModelManagementView";
import APIConfigView from "@/components/APIConfigView";

export default function App() {
  const { currentView } = useAppStore();

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {currentView === "chat" && <ChatView />}
        {currentView === "models" && <ModelManagementView />}
        {currentView === "api" && <APIConfigView />}
      </main>
    </div>
  );
}
