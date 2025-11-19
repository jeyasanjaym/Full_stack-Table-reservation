import React from 'react';
import './ChatbotModal.css';

const CHATBOT_ID = 'RQ_Vrd4UBQyyTKObqqBZN';
const CHAT_URL = `https://www.chatbase.co/chatbot-iframe/${CHATBOT_ID}`;

const ChatbotModal = ({ open, onClose }) => {
  const [iframeError, setIframeError] = React.useState(false);

  React.useEffect(() => {
    if (open) setIframeError(false);
  }, [open]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  const openInNewTab = () => {
    const url = `https://www.chatbase.co/chatbot-iframe/${CHATBOT_ID}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div className="chatbot-modal" onClick={stop}>
        <div className="chatbot-header">
          <h3>Assistant</h3>
          <button className="chatbot-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="chatbot-body">
          {iframeError ? (
            <div className="chatbot-error">
              <div className="error-content">
                <div className="error-icon">❌</div>
                <p>Chat is currently unavailable</p>
                <p>The bot may not be published yet.</p>
                <button className="retry-btn" onClick={openInNewTab}>Open in New Tab</button>
              </div>
            </div>
          ) : (
            <iframe
              title="Chatbase Chatbot"
              src={CHAT_URL}
              className="chatbot-iframe"
              allow="clipboard-write; microphone;"
              onError={() => setIframeError(true)}
              onLoad={(e) => {
                if (e.target.src.includes('404')) {
                  setIframeError(true);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
