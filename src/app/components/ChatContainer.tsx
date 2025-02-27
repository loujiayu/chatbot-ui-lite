import React, { useRef, useEffect } from 'react';

interface ChatContainerProps {
  messages: { type: string; content: string; isImage?: boolean }[];
  isLoadingPrompt: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: (text?: string) => void;
  disabled?: boolean; // Add this prop
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoadingPrompt,
  inputValue,
  setInputValue,
  sendMessage,
  disabled = false // Default to false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages" id="chatMessages">
        {disabled && (
          <div className="loading-history-container">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {!disabled && messages.length === 0 && (
          <div className="empty-chat-message">
            <p>No messages yet. Start a conversation!</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="message-wrapper">
              <div className="message-icon">
                <i className={`fas fa-${msg.type === 'user' ? 'user' : 'robot'}`}></i>
              </div>
              <div className={`message-content`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={disabled ? "Loading history..." : "Type your message..."}
          disabled={disabled}
        />
        <button onClick={() => sendMessage()} className="send-button" disabled={disabled}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
