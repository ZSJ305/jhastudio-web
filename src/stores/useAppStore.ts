import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: {
    text: string;
    imageData?: string;
  };
  timestamp: Date;
  isStreaming: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GGUFModel {
  id: string;
  name: string;
  size: number;
  dateAdded: Date;
}

export interface APIConfig {
  id: string;
  name: string;
  provider: string;
  baseURL: string;
  apiKey: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  isEnabled: boolean;
}

type ViewType = "chat" | "models" | "api";

interface AppState {
  currentView: ViewType;
  sessions: ChatSession[];
  currentSessionId: string | null;
  models: GGUFModel[];
  selectedModelId: string | null;
  apiConfigs: APIConfig[];
  selectedAPIId: string | null;
  isGenerating: boolean;
  sidebarOpen: boolean;

  setCurrentView: (view: ViewType) => void;
  createSession: () => void;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  clearMessages: (sessionId: string) => void;
  addModel: (model: GGUFModel) => void;
  deleteModel: (id: string) => void;
  selectModel: (id: string | null) => void;
  addAPIConfig: (config: APIConfig) => void;
  updateAPIConfig: (config: APIConfig) => void;
  deleteAPIConfig: (id: string) => void;
  selectAPI: (id: string | null) => void;
  setIsGenerating: (value: boolean) => void;
  toggleSidebar: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "New Chat",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: { text: "Hello, please introduce yourself" },
        timestamp: new Date(Date.now() - 60000),
        isStreaming: false,
      },
      {
        id: "msg-2",
        role: "assistant",
        content: {
          text: "Hello! I am an AI assistant that can help you answer questions, generate text, analyze images, and more. You can chat with me by selecting a local GGUF model or configuring an API.",
        },
        timestamp: new Date(Date.now() - 55000),
        isStreaming: false,
      },
    ],
    createdAt: new Date(Date.now() - 60000),
    updatedAt: new Date(Date.now() - 55000),
  },
  {
    id: "session-2",
    title: "Code Discussion",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: { text: "How to use async/await in Swift?" },
        timestamp: new Date(Date.now() - 3600000),
        isStreaming: false,
      },
      {
        id: "msg-4",
        role: "assistant",
        content: {
          text: "In Swift, async/await is the modern way to handle asynchronous operations. Here's how to use it:\n\n```swift\nfunc fetchData() async throws -> Data {\n    let (data, _) = try await URLSession.shared.data(from: url)\n    return data\n}\n\n// Usage\nTask {\n    do {\n        let data = try await fetchData()\n        print(data)\n    } catch {\n        print(error)\n    }\n}\n```",
        },
        timestamp: new Date(Date.now() - 3500000),
        isStreaming: false,
      },
    ],
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3500000),
  },
];

const initialModels: GGUFModel[] = [
  { id: "model-1", name: "llama-2-7b-chat", size: 3_800_000_000, dateAdded: new Date(Date.now() - 86400000) },
  { id: "model-2", name: "mistral-7b-instruct", size: 4_100_000_000, dateAdded: new Date(Date.now() - 172800000) },
];

const initialAPIs: APIConfig[] = [
  {
    id: "api-1",
    name: "OpenAI GPT-4",
    provider: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    apiKey: "sk-****",
    modelName: "gpt-4o",
    temperature: 0.7,
    maxTokens: 2048,
    isEnabled: true,
  },
  {
    id: "api-2",
    name: "Local Ollama",
    provider: "Custom",
    baseURL: "http://localhost:11434/v1",
    apiKey: "",
    modelName: "llama2",
    temperature: 0.8,
    maxTokens: 4096,
    isEnabled: true,
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  currentView: "chat",
  sessions: initialSessions,
  currentSessionId: "session-1",
  models: initialModels,
  selectedModelId: "model-1",
  apiConfigs: initialAPIs,
  selectedAPIId: "api-1",
  isGenerating: false,
  sidebarOpen: true,

  setCurrentView: (view) => set({ currentView: view }),

  createSession: () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      currentSessionId: newSession.id,
      currentView: "chat",
    }));
  },

  selectSession: (id) => set({ currentSessionId: id, currentView: "chat" }),

  deleteSession: (id) =>
    set((state) => {
      const newSessions = state.sessions.filter((s) => s.id !== id);
      return {
        sessions: newSessions,
        currentSessionId: state.currentSessionId === id ? newSessions[0]?.id || null : state.currentSessionId,
      };
    }),

  addMessage: (sessionId, message) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, messages: [...s.messages, message], updatedAt: new Date() }
          : s
      ),
    })),

  updateMessage: (sessionId, messageId, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: s.messages.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
              updatedAt: new Date(),
            }
          : s
      ),
    })),

  clearMessages: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, messages: [], updatedAt: new Date() } : s
      ),
    })),

  addModel: (model) => set((state) => ({ models: [...state.models, model] })),
  deleteModel: (id) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== id),
      selectedModelId: state.selectedModelId === id ? null : state.selectedModelId,
    })),
  selectModel: (id) => set({ selectedModelId: id }),

  addAPIConfig: (config) => set((state) => ({ apiConfigs: [...state.apiConfigs, config] })),
  updateAPIConfig: (config) =>
    set((state) => ({
      apiConfigs: state.apiConfigs.map((c) => (c.id === config.id ? config : c)),
    })),
  deleteAPIConfig: (id) =>
    set((state) => ({
      apiConfigs: state.apiConfigs.filter((c) => c.id !== id),
      selectedAPIId: state.selectedAPIId === id ? null : state.selectedAPIId,
    })),
  selectAPI: (id) => set({ selectedAPIId: id }),

  setIsGenerating: (value) => set({ isGenerating: value }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
