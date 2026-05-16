import { useAppStore } from "@/stores/useAppStore";
import { Box, Upload, Trash2, Check, HardDrive } from "lucide-react";
import { useState } from "react";

export default function ModelManagementView() {
  const { models, selectedModelId, addModel, deleteModel, selectModel } = useAppStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    return `${(bytes / 1e3).toFixed(1)} KB`;
  };

  const handleImport = () => {
    // Simulate import
    const newModel = {
      id: Math.random().toString(36).substring(2, 15),
      name: `imported-model-${models.length + 1}`,
      size: Math.floor(Math.random() * 5e9) + 1e9,
      dateAdded: new Date(),
    };
    addModel(newModel);
  };

  return (
    <div className="flex-1 bg-background h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">Model Management</h1>
            <p className="text-text-secondary mt-1">Import and manage GGUF model files</p>
          </div>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import Model
          </button>
        </div>

        {/* Import card */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-text">Import GGUF Model</h3>
              <p className="text-sm text-text-secondary mt-0.5">Supports .gguf format model files</p>
            </div>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-surface-hover hover:bg-border text-text rounded-lg text-sm font-medium transition-colors border border-border"
            >
              Select File
            </button>
          </div>
        </div>

        {/* Models list */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
            Imported Models ({models.length})
          </h3>

          {models.length === 0 ? (
            <div className="text-center py-12">
              <Box className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <p className="text-text-secondary">No Models</p>
              <p className="text-text-tertiary text-sm mt-1">Tap above to import GGUF model files</p>
            </div>
          ) : (
            models.map((model) => (
              <div
                key={model.id}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                  selectedModelId === model.id
                    ? "bg-primary/5 border-primary/30"
                    : "bg-surface border-border hover:border-border/80"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedModelId === model.id ? "bg-primary/20" : "bg-surface-hover"
                  }`}
                >
                  <Box
                    className={`w-5 h-5 ${
                      selectedModelId === model.id ? "text-primary" : "text-text-secondary"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-text truncate">{model.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {formatSize(model.size)}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {model.dateAdded.toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectModel(selectedModelId === model.id ? null : model.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedModelId === model.id
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-surface-hover text-text-secondary"
                    }`}
                  >
                    {selectedModelId === model.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium px-2">Select</span>
                    )}
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(model.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-text mb-2">Confirm Delete</h3>
            <p className="text-text-secondary text-sm mb-6">
              Are you sure you want to delete model "{models.find((m) => m.id === showDeleteConfirm)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-text-secondary hover:bg-surface-hover transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteModel(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
