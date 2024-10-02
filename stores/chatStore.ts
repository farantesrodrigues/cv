import { create } from 'zustand';

export interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatState {
  messages: Message[];
  addMessage: (sender: 'user' | 'bot', text: string) => void;
  clearMessages: () => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      sender: 'bot',
      text: "Ask me anything you'd expect to learn from a cv...",
    },
  ],
  addMessage: (sender, text) =>
    set((state) => ({ messages: [...state.messages, { sender, text }] })),
  clearMessages: () => set(() => ({ messages: [] })),
}));

export default useChatStore;
