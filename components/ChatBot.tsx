'use client';

import { useState, useEffect, useRef } from 'react';
import useChatStore from '../stores/chatStore';
import { getOpenAIBotReply } from '../utils/api';

// Function to parse response text for newlines and markdown (like **bold**)
const parseResponseText = (text: string) => {
  // First, replace newlines with line breaks
  const lines = text.split('\n').map((line, index) => (
    <span key={index}>
      {parseMarkdownSimple(line)}
      <br />
    </span>
  ));

  return lines;
};

// Simple markdown parser for **bold** text
const parseMarkdownSimple = (text: string) => {
  // Handle bold (**text**)
  const boldParsed = text.split(/\*\*(.*?)\*\*/g).map((segment, index) => {
    return index % 2 === 1 ? <strong key={index}>{segment}</strong> : segment;
  });

  return boldParsed;
};

const ChatBot = () => {
  // Zustand store for managing messages
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false); // State to indicate if the bot is typing
  const messagesEndRef = useRef<HTMLDivElement>(null); // Reference to the bottom of the messages container

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message to the global store
    addMessage('user', input);

    // Set typing indicator to true
    setTyping(true);

    // Clear the input field
    setInput('');

    // Fetch bot's reply from the API
    const reply = await getOpenAIBotReply(input);

    // Add bot's reply to the global store
    addMessage('bot', reply);

    // Set typing indicator to false
    setTyping(false);
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing]);

  return (
    <div className="flex flex-col h-full border rounded-lg bg-gray-100 shadow-md overflow-hidden">
      {/* Chat content container with overflow-y to enable scrolling */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded ${
                msg.sender === 'bot'
                  ? 'bg-teal-600 text-gray-200'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {/* Parse and display the message */}
              {parseResponseText(msg.text)}
            </span>
          </div>
        ))}
        {/* Typing indicator */}
        {typing && (
          <div className="mb-2 text-left">
            <span className="inline-block px-3 py-2 rounded bg-teal-600 text-gray-200">
              <TypingIndicator />
            </span>
          </div>
        )}
        {/* Dummy div to scroll into view */}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t flex items-center gap-2">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded text-gray-600 focus-within:border-teal-800"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-teal-600 text-gray-200 rounded hover:bg-teal-800 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Component to render animated three dots
const TypingIndicator = () => {
  return (
    <span className="flex gap-1">
      <span className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></span>
      <span className="w-2 h-2 bg-gray-200 rounded-full animate-pulse animation-delay-200"></span>
      <span className="w-2 h-2 bg-gray-200 rounded-full animate-pulse animation-delay-400"></span>
    </span>
  );
};

export default ChatBot;
