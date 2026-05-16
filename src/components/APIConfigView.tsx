import { useAppStore } from "@/stores/useAppStore";
import { Network, Plus, Trash2, Pencil, Check, Shield, Server } from "lucide-react";
import { useState } from "react";

interface APIFormData {
  name: string;
  provider: string;
  baseURL: string;
  apiKey: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
}

export default function APIConfigView() {
  const { apiConfigs, selectedAPIId, addAPIConfig, updateAPIConfig, deleteAPIConfig, selectAPI } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<APIFormData>({
    name: "",
    provider: "Custom",
    baseURL: "",
    apiKey: "",
    modelName: "",
    temperature: 0.7,
    maxTokens: 2048,
  });

  const providers = ["OpenAI", "Azure", "Anthropic", "Custom"];

  const handleEdit = (config: (typeof apiConfigs)[0]) => {
    setFormData({
      name: config.name,
      provider: config.provider,
      baseURL: config.baseURL,
      apiKey: config.apiKey,
      modelName: config.modelName,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    });
    setEditingId(config.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.baseURL || !formData.modelName) return;

    const config = {
      id: editingId || Math.random().toString(36).substring(2, 15),
      ...formData,
      isEnabled: true,
    };

    if (editingId) {
      updateAPIConfig(config);
    } else {
      addAPIConfig(config);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      provider: "Custom",
      baseURL: "",
      apiKey: "",
      modelName: "",
      temperature: 0.7,
      maxTokens: 2048,
    });
  };

  const selectedConfig = apiConfigs.find((c) => c.id === selectedAPIId);

  return (
    <div className="flex-1 bg-background h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">API Configuration</h1>
            <p className="text-text-secondary mt-1">Manage custom API endpoints and keys</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                provider: "Custom",
                baseURL: "",
                apiKey: "",
                modelName: "",
                temperature: 0.7,
                maxTokens: 2048,
              });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-success hover:bg-success-hover text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Configuration
          </button>
        </div>

        {/* Selected config card */}
        {selectedConfig && (
          <div className="bg-surface border border-success/30 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-text">{selectedConfig.name}</h3>
                <span className="text-xs text-success font-medium">Currently Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-tertiary text-xs mb-1">Base URL</p>
                <p className="text-text truncate">{selectedConfig.baseURL}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs mb-1">Model</p>
                <p className="text-text">{selectedConfig.modelName}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs mb-1">Temperature</p>
                <p className="text-text">{selectedConfig.temperature}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs mb-1">Max Tokens</p>
                <p className="text-text">{selectedConfig.maxTokens}</p>
              </div>
            </div>
          </div>
        )}

        {/* Configs list */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
            All Configurations ({apiConfigs.length})
          </h3>

          {apiConfigs.map((config) => (
            <div
              key={config.id}
              className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                selectedAPIId === config.id
                  ? "bg-success/5 border-success/30"
                  : "bg-surface border-border hover:border-border/80"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedAPIId === config.id ? "bg-success/20" : "bg-surface-hover"
                }`}
              >
                <Server
                  className={`w-5 h-5 ${
                    selectedAPIId === config.id ? "text-success" : "text-text-secondary"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-text truncate">{config.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-text-tertiary">
                    {config.provider}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 truncate">{config.baseURL}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => selectAPI(selectedAPIId === config.id ? null : config.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedAPIId === config.id
                      ? "bg-success/20 text-success"
                      : "hover:bg-surface-hover text-text-secondary"
                  }`}
                >
                  {selectedAPIId === config.id ? <Check className="w-4 h-4" /> : <span className="text-xs font-medium px-2">Select</span>}
                </button>

                <button
                  onClick={() => handleEdit(config)}
                  className="p-2 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(config.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text mb-6">
              {editingId ? "Edit Configuration" : "Add Configuration"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Configuration Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. OpenAI GPT-4"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Provider</label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
                >
                  {providers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Base URL</label>
                <input
                  type="text"
                  value={formData.baseURL}
                  onChange={(e) => setFormData({ ...formData, baseURL: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">API Key</label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Model Name</label>
                <input
                  type="text"
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  placeholder="gpt-4o"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Temperature: {formData.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Max Tokens</label>
                  <input
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                    min="256"
                    max="8192"
                    step="256"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2.5 rounded-xl text-text-secondary hover:bg-surface-hover transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.baseURL || !formData.modelName}
                className="px-4 py-2.5 rounded-xl bg-success hover:bg-success-hover text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-text mb-2">Confirm Delete</h3>
            <p className="text-text-secondary text-sm mb-6">
              Are you sure you want to delete configuration "{apiConfigs.find((c) => c.id === showDeleteConfirm)?.name}"?
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
                  deleteAPIConfig(showDeleteConfirm);
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
