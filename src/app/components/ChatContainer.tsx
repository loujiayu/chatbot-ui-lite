import React, { useRef, useEffect } from 'react';

interface ChatContainerProps {
  messages: { type: string; content: string; isImage?: boolean }[];
  isLoadingPrompt: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: (text?: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleVoiceInput: () => void;
  isRecording: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoadingPrompt,
  inputValue,
  setInputValue,
  sendMessage,
  handleImageUpload,
  toggleVoiceInput,
  isRecording,
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
        {isLoadingPrompt ? (
          <div className="text-white text-center space-y-4">
            <div className="loading-spinner" />
            <p>Loading prompt...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
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
          ))
        )}
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
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button className="camera-button" onClick={() => document.getElementById('imageInput')?.click()}>
          <i className="fas fa-camera"></i>
        </button>
        <button className="voice-button" onClick={toggleVoiceInput}>
          <i className={`fas fa-microphone${isRecording ? '-slash' : ''}`}></i>
        </button>
        <button onClick={() => sendMessage()} className="send-button">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
