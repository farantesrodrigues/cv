'use client';

import { useState, useEffect, useRef } from 'react';
import useChatStore from '../stores/chatStore';
import { getOpenAIBotReply } from '../utils/api';
import Toolbar from './Toolbar';
import { exportChatToPdf } from '../utils/exportToPdf';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import DynamicCV from './DynamicCV';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

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
  const [showCVModal, setShowCVModal] = useState(false); // State to control the CV modal visibility
  const messagesEndRef = useRef<HTMLDivElement>(null); // Reference to the bottom of the messages container
  const cvRef = useRef<HTMLDivElement>(null); // Reference for the CV element

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
  
  const handleDownloadCV = () => {
    if (!cvRef.current) {
      console.error('CV element not found');
      return;
    }
  
    // Customize the options for html2pdf
    const options = {
      margin: [10, 10, 10, 10], // Margins in mm: top, right, bottom, left
      filename: 'francisco_arantes_cv.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // Improve resolution for higher quality
        useCORS: true, // Enables cross-origin support if needed
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    };
  
    // @ts-expect-error('missing typings in html2pdf')
    import('html2pdf.js').then((html2pdf: Module) => {
      html2pdf.default().set(options).from(cvRef.current).save();
    });
  };

  // Toolbar functionalities
  const exportChat = () => {
    exportChatToPdf(messages);
  };

  const downloadCV = () => {
    setShowCVModal(true); // Set modal visibility to true to open the modal
  };

  const visitSourceCode = () => {
    window.open('https://github.com/farantesrodrigues/cv', '_blank');
  };

  // Function to add a prepared prompt
  const addPreparedPrompt = (prompt: string) => {
    handleSend(prompt); // Use the handleSend function with the prepared prompt text
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-gray-100 shadow-md overflow-hidden">
      {/* Toolbar */}
      <Toolbar exportChat={exportChat} downloadCV={downloadCV} visitSourceCode={visitSourceCode} addPreparedPrompt={addPreparedPrompt} />

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

      {showCVModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg w-[800px] h-auto max-h-[90%] overflow-auto relative">
          
          {/* Sticky Toolbar */}
          <div className="sticky top-0 bg-white p-4 border-b flex justify-end gap-4">
            
            {/* Close Button */}
            <button
              onClick={() => setShowCVModal(false)}
              className="text-gray-600 hover:text-gray-800"
              aria-label="Close Modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadCV}
              className="text-gray-600 hover:text-gray-800"
              aria-label="Download CV"
            >
              <ArrowDownTrayIcon className="h-6 w-6" />
            </button>

          </div>

          {/* Dynamic CV Component */}
          <div ref={cvRef} className="cv-container p-4">
            <DynamicCV />
          </div>
        </div>
      </div>
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