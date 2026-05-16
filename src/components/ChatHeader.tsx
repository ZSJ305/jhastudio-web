import { useAppStore } from "@/stores/useAppStore";
import { Box, Network, MoreHorizontal, Trash, Pencil, ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function ChatHeader() {
  const {
    sessions,
    currentSessionId,
    models,
    selectedModelId,
    apiConfigs,
    selectedAPIId,
    sidebarOpen,
    setCurrentView,
    clearMessages,
    selectModel,
    selectAPI,
    toggleSidebar,
  } = useAppStore();

  const [showMenu, setShowMenu] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showAPIPicker, setShowAPIPicker] = useState(false);

  const session = sessions.find((s) => s.id === currentSessionId);
  const selectedModel = models.find((m) => m.id === selectedModelId);
  const selectedAPI = apiConfigs.find((a) => a.id === selectedAPIId);

  return (
    <div className="glass border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
          )}
          <div>
            <h2 className="text-base font-semibold text-text">{session?.title || "New Chat"}</h2>
            <div className="flex items-center gap-2 mt-1">
              {/* Model selector */}
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                <Box className="w-3 h-3" />
                {selectedModel?.name || "Select Model"}
              </button>

              {/* API selector */}
              <button
                onClick={() => setShowAPIPicker(!showAPIPicker)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors"
              >
                <Network className="w-3 h-3" />
                {selectedAPI?.name || "Select API"}
              </button>
            </div>
          </div>
        </div>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    if (currentSessionId) clearMessages(currentSessionId);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-surface-hover transition-colors"
                >
                  <Trash className="w-4 h-4 text-red-400" />
                  Clear Chat
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-surface-hover transition-colors"
                >
                  <Pencil className="w-4 h-4 text-text-secondary" />
                  Rename
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Model picker dropdown */}
      {showModelPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
          <div className="absolute left-4 top-full mt-2 w-64 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-2">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider px-2 py-1">Downloaded Models</p>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    selectModel(model.id);
                    setShowModelPicker(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    selectedModelId === model.id ? "bg-primary/10 text-primary" : "text-text hover:bg-surface-hover"
                  }`}
                >
                  <Box className="w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{model.name}</p>
                    <p className="text-xs text-text-tertiary">{(model.size / 1e9).toFixed(1)} GB</p>
                  </div>
                  {selectedModelId === model.id && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowModelPicker(false);
                  setCurrentView("models");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-text-secondary hover:bg-surface-hover transition-colors"
              >
                <Box className="w-4 h-4" />
                <span className="text-sm">Manage Models...</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* API picker dropdown */}
      {showAPIPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowAPIPicker(false)} />
          <div className="absolute left-32 top-full mt-2 w-64 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-2">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider px-2 py-1">API Configurations</p>
              {apiConfigs.map((api) => (
                <button
                  key={api.id}
                  onClick={() => {
                    selectAPI(api.id);
                    setShowAPIPicker(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    selectedAPIId === api.id ? "bg-success/10 text-success" : "text-text hover:bg-surface-hover"
                  }`}
                >
                  <Network className="w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{api.name}</p>
                    <p className="text-xs text-text-tertiary">{api.provider}</p>
                  </div>
                  {selectedAPIId === api.id && (
                    <div className="w-2 h-2 rounded-full bg-success" />
                  )}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowAPIPicker(false);
                  setCurrentView("api");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-text-secondary hover:bg-surface-hover transition-colors"
              >
                <Network className="w-4 h-4" />
                <span className="text-sm">Manage APIs...</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
