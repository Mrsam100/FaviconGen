/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useToast } from './Toast';
import { getUserFriendlyMessage } from '../utils/errorHandling';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI Literacy Guide. Ask me anything about digital safety.', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) {
      showToast('Please enter a message.', 'warning');
      return;
    }

    // Reset error state
    setErrorMessage(null);

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToGemini(history, userMsg.text);

      const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = getUserFriendlyMessage(error);
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Assistant error:', error);

      // Add error message to chat so user sees it in context
      const errorChatMsg: ChatMessage = {
        role: 'model',
        text: `I'm sorry, I encountered an error: ${errorMsg}. Please try again.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorChatMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-[#F5F2EB] rounded-none shadow-2xl shadow-[#2C2A26]/10 w-[90vw] sm:w-[380px] h-[550px] mb-6 flex flex-col overflow-hidden border border-[#D6D1C7] animate-slide-up-fade">
          {/* Header */}
          <div className="bg-[#EBE7DE] p-5 border-b border-[#D6D1C7] flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#b45309] rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="font-serif italic text-[#2C2A26] text-lg">Schroeder Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#A8A29E] hover:text-[#2C2A26] transition-colors"
              aria-label="Close assistant chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F5F2EB]" ref={scrollRef} role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#2C2A26] text-[#F5F2EB]'
                      : 'bg-white border border-[#EBE7DE] text-[#5D5A53] shadow-sm'
                  }`}
                  role="article"
                  aria-label={msg.role === 'user' ? 'Your message' : 'Assistant message'}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
               <div className="flex justify-start">
                 <div className="bg-white border border-[#EBE7DE] p-5 flex gap-1 items-center shadow-sm" role="status" aria-label="Assistant is thinking">
                   <div className="w-1.5 h-1.5 bg-[#A8A29E] rounded-full animate-bounce" aria-hidden="true"></div>
                   <div className="w-1.5 h-1.5 bg-[#A8A29E] rounded-full animate-bounce delay-75" aria-hidden="true"></div>
                   <div className="w-1.5 h-1.5 bg-[#A8A29E] rounded-full animate-bounce delay-150" aria-hidden="true"></div>
                   <span className="sr-only">Assistant is thinking...</span>
                 </div>
               </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-5 bg-[#F5F2EB] border-t border-[#D6D1C7]">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about AI..."
                className="flex-1 bg-white border border-[#D6D1C7] focus:border-[#2C2A26] px-4 py-3 text-sm outline-none transition-colors placeholder-[#A8A29E] text-[#2C2A26]"
                aria-label="Message input"
                disabled={isThinking}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isThinking}
                className="bg-[#2C2A26] text-[#F5F2EB] px-4 rounded-full hover:bg-[#444] transition-colors disabled:opacity-50"
                aria-label={isThinking ? 'Waiting for response' : 'Send message'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2C2A26] text-[#F5F2EB] w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:scale-105 transition-all duration-500 z-50 border border-[#b45309]"
        aria-label={isOpen ? 'Close AI assistant chat' : 'Open AI assistant chat for help'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
             </svg>
        ) : (
            <span className="font-serif italic text-lg">?</span>
        )}
      </button>
    </div>
  );
};

export default Assistant;