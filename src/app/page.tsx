'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{
    type: 'assistant',
    content: "Hello! Its Vicki, what brings you in today?"
  }]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInputValue(text);
        sendMessage(text);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognition);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleVoiceInput = () => {
    if (recognition) {
      if (isRecording) {
        recognition.stop();
        setIsRecording(false);
      } else {
        recognition.start();
        setIsRecording(true);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setMessages(prev => [...prev, 
          { type: 'user', content: imageUrl, isImage: true },
          { type: 'assistant', content: 'I received your image. How can I help you with this?' }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = (text: string = inputValue) => {
    if (text.trim()) {
      setMessages(prev => [...prev, 
        { type: 'user', content: text },
        { type: 'assistant', content: "I understand. Please tell me more about how you're feeling." }
      ]);
      setInputValue('');
    }
  };

  const showHIPAAPrompt = () => {
    const modal = document.getElementById('hipaaModal');
    if (modal) modal.style.display = 'flex';
  };

  const handleHIPAAPermission = (granted: boolean) => {
    const modal = document.getElementById('hipaaModal');
    if (granted) {
      alert('Thank you. Access to your health records has been granted.');
    } else {
      alert('Access to health records was denied.');
    }
    if (modal) modal.style.display = 'none';
  };

  return (
    <div className="phone-container">
      <div className="main-content">
        <div className="health-icon">
          <i className="fas fa-heartbeat" style={{ color: 'white', fontSize: '30px' }}></i>
        </div>
        
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
        
        <div className="nav-buttons">
          <div className="nav-item">
            <button className="nav-button" onClick={showHIPAAPrompt}>
              <i className="fas fa-shield-alt"></i>
            </button>
            <span className="nav-label">HIPAA</span>
          </div>
          <div className="nav-item">
            <button className="nav-button">
              <i className="fas fa-heart"></i>
            </button>
            <span className="nav-label">Tests</span>
          </div>
          <div className="nav-item">
            <button className="nav-button">
              <i className="fas fa-bell"></i>
            </button>
            <span className="nav-label">Alerts</span>
          </div>
        </div>
      </div>

      <div id="hipaaModal" className="modal">
        <div className="modal-content">
          <h2>HIPAA Records Access</h2>
          <p>Would you like to grant access to your HIPAA-compliant Electronic Health Records (EHR) and Electronic Medical Records (EMR)?</p>
          <p className="privacy-note">Your privacy is protected under HIPAA regulations.</p>
          <div className="modal-buttons">
            <button onClick={() => handleHIPAAPermission(true)} className="allow-btn">Allow Access</button>
            <button onClick={() => handleHIPAAPermission(false)} className="deny-btn">Deny Access</button>
          </div>
        </div>
      </div>
    </div>
  );
}