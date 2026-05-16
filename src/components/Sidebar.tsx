import { useAppStore } from "@/stores/useAppStore";
import { MessageSquare, Box, Network, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const {
    sessions,
    currentSessionId,
    currentView,
    sidebarOpen,
    createSession,
    selectSession,
    deleteSession,
    setCurrentView,
    toggleSidebar,
  } = useAppStore();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-border transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-0 lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-lg font-semibold text-text tracking-tight">jhastudio</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Sessions */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Chats</span>
              <button
                onClick={createSession}
                className="p-1 rounded-md hover:bg-surface-hover transition-colors"
              >
                <Plus className="w-4 h-4 text-primary" />
              </button>
            </div>
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentSessionId === session.id && currentView === "chat"
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-surface-hover border border-transparent"
                  }`}
                  onClick={() => selectSession(session.id)}
                >
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 ${
                      currentSessionId === session.id && currentView === "chat"
                        ? "text-primary"
                        : "text-text-secondary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{session.title}</p>
                    <p className="text-xs text-text-tertiary">{formatDate(session.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider px-1">Settings</span>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => setCurrentView("models")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  currentView === "models"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-text-secondary hover:bg-surface-hover border border-transparent"
                }`}
              >
                <Box className="w-4 h-4" />
                <span className="text-sm font-medium">Model Management</span>
              </button>
              <button
                onClick={() => setCurrentView("api")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  currentView === "api"
                    ? "bg-success/10 text-success border border-success/20"
                    : "text-text-secondary hover:bg-surface-hover border border-transparent"
                }`}
              >
                <Network className="w-4 h-4" />
                <span className="text-sm font-medium">API Configuration</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button for collapsed sidebar on desktop */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-30 hidden lg:flex p-2 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-text-secondary" />
        </button>
      )}
    </>
  );
}
