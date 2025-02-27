import React, { useRef, useEffect } from 'react';

interface ChatContainerProps {
  messages: { type: string; content: string; isImage?: boolean }[];
  isLoadingPrompt: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: (text?: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoadingPrompt,
  inputValue,
  setInputValue,
  sendMessage,
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
          placeholder="Type your message..."
        />
        <button onClick={() => sendMessage()} className="send-button">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
