import { create } from 'zustand';

interface Message {
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
      text: "Hey! This is Francisco Arantes speaking—well, sort of. Feel free to ask me about my career path, academic studies, or skills. I'm here to help you explore any aspect of my professional journey.",
    },
  ],
  addMessage: (sender, text) =>
    set((state) => ({ messages: [...state.messages, { sender, text }] })),
  clearMessages: () => set(() => ({ messages: [] })),
}));

export default useChatStore;
