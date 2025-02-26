'use client';

import { useState, useEffect } from 'react';
import SSOLogin from './SSOLogin';
import ChatContainer from './components/ChatContainer';
import NavButtons from './components/NavButtons';
import useAuthStore from './store/useAuthStore';

const fetchDefaultPrompt = () => {
  return new Promise<string>(async (resolve) => {
    const response = await fetch('https://prompts-85352025976.us-central1.run.app?key=patient');
    if (!response.ok) throw new Error('Failed to fetch prompt');
    const data = await response.text();
    resolve(JSON.parse(data).content)
  });
};

interface Notification {
  message: string;
  type: 'success' | 'error';
}

export default function Home() {
  const { showSSOLogin, setShowSSOLogin } = useAuthStore();
  const [messages, setMessages] = useState([{
    type: 'assistant',
    content: "Hello! Its Vicki, what brings you in today?"
  }]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(true);
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
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
    const loadPrompt = async () => {
      try {
        const prompt = await fetchDefaultPrompt();
        setInstruction(prompt)
      } catch (error) {
        console.error('Error loading default prompt:', error);
      } finally {
        setIsLoadingPrompt(false);
      }
    };
    loadPrompt();
  }, []);

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

  const sendMessage = async (text: string = inputValue) => {
    if (text.trim()) {
      const updatedMessages = [
        ...messages,
        { type: 'user', content: text }
      ];
      setMessages(updatedMessages);
      setInputValue('');

      try {
        const response = await fetch('https://doctormt-85352025976.us-central1.run.app?ispatient=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: updatedMessages,
            instruction
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          content: data.message || "I understand. Please tell me more about how you're feeling."
        }]);
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
      const response = await fetch('https://prompts-85352025976.us-central1.run.app?key=patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: instruction
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }

      showNotification('Configuration saved successfully.', 'success');
      if (modal) modal.style.display = 'none';
    } catch (error) {
      console.error('Error saving prompt:', error);
      showNotification('Failed to save configuration. Please try again.', 'error');
    } finally {
      setIsSavingPrompt(false);
    }
  };

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

  const navigateToSSOLogin = () => {
    setShowSSOLogin(true);
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
            isLoadingPrompt={isLoadingPrompt}
            inputValue={inputValue}
            setInputValue={setInputValue}
            sendMessage={sendMessage}
            handleImageUpload={handleImageUpload}
            toggleVoiceInput={toggleVoiceInput}
            isRecording={isRecording}
          />
          
          <NavButtons
            showHIPAAPrompt={showHIPAAPrompt}
            showConfigPrompt={showConfigPrompt}
            navigateToSSOLogin={navigateToSSOLogin}
          />
        </div>
      )}
      <div id="hipaaModal" className="modal">
        <div className="modal-content">
          <h2>HIPAA Records Access</h2>
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