'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, Message } from './services/chatService';
import { 
  fetchPrompt, 
  savePrompt
} from './services/promptService';
import { 
  fetchChatHistory,
  saveChatHistory 
} from './services/chatHistoryService';
import SSOLogin from './SSOLogin';
import useAuthStore from './store/useAuthStore';
import NavButtons from './components/NavButtons';
import ChatContainer from './components/ChatContainer';
import { logout } from './services/authService';

interface Notification {
  message: string;
  type: 'success' | 'error';
}

export default function Home() {
  const { showSSOLogin, setShowSSOLogin, userId } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(true);
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.querySelector('#configModal .modal-content');
      if (modal && !modal.contains(event.target as Node)) {
        const modelContainer = document.getElementById("configModal")!;
        modelContainer.style.display = 'none';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      loadPrompt();
      loadChatHistory();
    }
  }, [userId]);

  const loadPrompt = async () => {
    setIsLoadingPrompt(true);
    try {
      const { success, content, error } = await fetchPrompt();
      
      if (success) {
        setInstruction(content);
      } else {
        console.error('Error loading prompt:', error);
      }
    } catch (error) {
      console.error('Error loading prompt:', error);
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  const loadChatHistory = async () => {
    setIsLoadingChatHistory(true);
    try {
      const { success, messages: chatHistory, error } = await fetchChatHistory();
      
      if (success && chatHistory.length > 0) {
        setMessages(chatHistory);
      } else if (error) {
        console.error('Error loading chat history:', error);
      }
      // If there's no chat history, we'll keep the default welcome message
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingChatHistory(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string = inputValue) => {
    if (text.trim() && !isLoadingChatHistory) {
      const updatedMessages = [
        ...messages,
        { type: 'user', content: text }
      ];
      setMessages(updatedMessages);
      setInputValue('');

      try {
        const { success, message, error } = await sendChatMessage(updatedMessages, instruction);
        
        if (success) {
          const newMessages = [
            ...updatedMessages,
            { type: 'assistant', content: message }
          ];
          setMessages(newMessages);
          
          // Save the updated chat history
          saveChatHistory(newMessages).catch(err => {
            console.error('Error saving chat history:', err);
          });
        } else {
          console.error('Error sending message:', error);
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            content: "I apologize, but I'm having trouble connecting right now. Please try again."
          }]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          content: "I apologize, but I'm having trouble connecting right now. Please try again."
        }]);
      }
    }
  };

  const showHIPAAPrompt = () => {
    const modal = document.getElementById('hipaaModal');
    if (modal) modal.style.display = 'flex';
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const showConfigPrompt = () => {
    const modal = document.getElementById('configModal');
    if (modal) modal.style.display = 'flex';
  };

  const handleHIPAAPermission = (granted: boolean) => {
    const modal = document.getElementById('hipaaModal');
    if (granted) {
      showNotification('Access to your health records has been granted.', 'success');
    } else {
      showNotification('Access to health records was denied.', 'error');
    }
    if (modal) modal.style.display = 'none';
  };

  const handleConfigSave = async () => {
    const modal = document.getElementById('configModal');
    setIsSavingPrompt(true);

    try {
      const { success, error } = await savePrompt(instruction);
      
      if (success) {
        showNotification('Configuration saved successfully.', 'success');
      } else {
        console.error('Error saving prompt:', error);
        showNotification('Failed to save configuration. Please try again.', 'error');
      }
      
      if (modal) modal.style.display = 'none';
    } catch (error) {
      console.error('Error saving prompt:', error);
      showNotification('Failed to save configuration. Please try again.', 'error');
    } finally {
      setIsSavingPrompt(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { success, error } = await logout();
      
      if (success) {
        // Reset auth state
        useAuthStore.getState().logout();
        showNotification('You have been logged out successfully.', 'success');
      } else {
        console.error('Logout error:', error);
        showNotification('Failed to logout. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('Failed to logout. Please try again.', 'error');
    }
  };

  return (
    <div className="phone-container">
      {showSSOLogin ? (
        <SSOLogin />
      ) : (
        <div className="main-content">
          <div className="health-icon">
            <i className="fas fa-heartbeat" style={{ color: 'white', fontSize: '30px' }}></i>
          </div>
          
          <ChatContainer
            messages={messages}
            isLoadingPrompt={isLoadingPrompt || isLoadingChatHistory}
            inputValue={inputValue}
            setInputValue={setInputValue}
            sendMessage={sendMessage}
            disabled={isLoadingChatHistory}
          />
          
          <NavButtons
            showHIPAAPrompt={showHIPAAPrompt}
            showConfigPrompt={showConfigPrompt}
            handleLogout={handleLogout}
            disabled={isLoadingChatHistory}
          />
        </div>
      )}

      <div id="hipaaModal" className="modal">
        <div className="modal-content">
          <h2>HIPAA Records Access</h2>
          {/* <p>Would you like to grant access to your HIPAA-compliant Electronic Health Records (EHR) and Electronic Medical Records (EMR)?</p> */}
          <p className="privacy-note">Your privacy is protected under HIPAA regulations.</p>
          <div className="modal-buttons">
            <button onClick={() => handleHIPAAPermission(true)} className="allow-btn">Allow Access</button>
            <button onClick={() => handleHIPAAPermission(false)} className="deny-btn">Deny Access</button>
          </div>
        </div>
      </div>
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <i className={`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      <div id="configModal" className="modal">
        <div className="modal-content">
          <h2>Prompt Configuration</h2>
          <div className="config-form">
            <div className="config-item">
              {isLoadingPrompt ? (
                <div className="text-white text-center space-y-4">
                  <div className="loading-spinner" />
                  <p>Loading prompt...</p>
                </div>
              ) : (
                <textarea 
                  className="config-input prompt-editor"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  rows={6}
                  placeholder="Enter custom system prompt (optional)"
                />
              )}
            </div>
          </div>
          <div className="modal-buttons">
            <button 
              onClick={handleConfigSave} 
              className="allow-btn"
              disabled={isSavingPrompt}
            >
              {isSavingPrompt ? (
                <>
                  <div className="loading-spinner-sm" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}