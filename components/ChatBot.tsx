'use client';

import { useState, useEffect, useRef } from 'react';
import useChatStore from '../stores/chatStore';
import { getOpenAIBotReply, getSessionId, parseResponseText, exportChatToPdf } from '../utils/chatHelpers';
import Toolbar from './Toolbar';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import DynamicCVModal from './DynamicCV';
import ProjectInfoModal from './ProjectInfo';


const ChatBot = () => {
  // Zustand store for managing messages
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false); // State to indicate if the bot is typing
  const [showCVModal, setShowCVModal] = useState(false); // State to control the CV modal visibility
  const [showProjInfoModal, setShowProjInfoModal] = useState(false); // State to control the Project Info modal visibility
  const messagesEndRef = useRef<HTMLDivElement>(null); // Reference to the bottom of the messages container

  const handleSend = async (text?: string) => {
    const messageToSend = text || input.trim();
    if (!messageToSend) return;

    // Add user's message to the global store
    addMessage('user', messageToSend);

    // Set typing indicator to true
    setTyping(true);

    // Clear the input field if using direct input
    if (!text) {
      setInput('');
    }

    const sessionId = getSessionId();

    // Fetch bot's reply from the API with sessionId
    const reply = await getOpenAIBotReply(messageToSend, sessionId);

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

  // Toolbar functionalities
  const exportChat = () => {
    exportChatToPdf(messages);
  };

  const downloadCV = () => {
    setShowCVModal(true);
  };

  const showProjectInfo = () => {
    setShowProjInfoModal(true)
  }

  const visitSourceCode = () => {
    window.open('https://github.com/farantesrodrigues/cv', '_blank');
  };

  const visitLinkedIn = () => {
    window.open('https://www.linkedin.com/in/farantesrodrigues/', '_blank');
  };

  // Function to add a prepared prompt
  const addPreparedPrompt = (prompt: string) => {
    handleSend(prompt); // Use the handleSend function with the prepared prompt text
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-gray-100 shadow-md overflow-hidden">
      {/* Toolbar */}
      <Toolbar exportChat={exportChat} downloadCV={downloadCV} visitSourceCode={visitSourceCode} visitLinkedIn={visitLinkedIn} addPreparedPrompt={addPreparedPrompt} showProjectInfo={showProjectInfo}/>

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
              {parseResponseText(msg.text)}
            </span>
          </div>
        ))}
        {typing && (
          <div className="mb-2 text-left">
            <span className="inline-block px-3 py-2 rounded bg-teal-600 text-gray-200">
              <TypingIndicator />
            </span>
          </div>
        )}
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
        <button onClick={() => handleSend()}
          className="relative group flex items-center gap-2 p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max p-2 rounded-md text-xs text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Send
          </span>
        </button>
      </div>

      {showProjInfoModal && (
        <ProjectInfoModal onClose={() => setShowProjInfoModal(false)}></ProjectInfoModal>
      )}

      {showCVModal && (
        <DynamicCVModal onClose={() => setShowCVModal(false)}></DynamicCVModal>
      )}

    </div>
  );
};

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