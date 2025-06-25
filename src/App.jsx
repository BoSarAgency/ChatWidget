import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState("");
  const messagesEndRef = useRef(null);

  // Configuration - reads from window.ChatWidgetConfig or uses defaults
  const defaultConfig = {
    title: "BoSar Chat Assistant",
    logo: null,
    initialMessage: "Hello! How can I help you today?",
    color: "#007bff",
    userMessageBgColor: "#007bff",
    userMessageTextColor: "#ffffff",
    assistantMessageBgColor: "#f1f1f1",
    assistantMessageTextColor: "#333333",
    apiURL: "https://e32c6941-f279-4527-90a1-c441352baff5-00-3saz0r6vecady.janeway.replit.dev/messages",
  };

  const config = {
    ...defaultConfig,
    ...(window.ChatWidgetConfig || {}),
  };

  // Generate random threadId on component mount
  useEffect(() => {
    const generateThreadId = () => {
      return (
        "thread_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
      );
    };
    setThreadId(generateThreadId());
  }, []);

  // Add initial message when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0 && config.initialMessage) {
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: config.initialMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, config.initialMessage]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(config.apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId: threadId,
          content: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-widget">
      {/* Floating Chat Button */}
      <button
        className="chat-toggle-btn"
        onClick={toggleChat}
        style={{ backgroundColor: config.color }}
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div
            className="chat-header"
            style={{ backgroundColor: config.color }}
          >
            {config.logo && (
              <img src={config.logo} alt="Logo" className="chat-logo" />
            )}
            <h3 className="chat-title">{config.title}</h3>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div
                  className="message-bubble"
                  style={{
                    backgroundColor:
                      message.role === "user"
                        ? config.userMessageBgColor
                        : config.assistantMessageBgColor,
                    color:
                      message.role === "user"
                        ? config.userMessageTextColor
                        : config.assistantMessageTextColor,
                  }}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="message assistant">
                <div
                  className="message-bubble loading"
                  style={{
                    backgroundColor: config.assistantMessageBgColor,
                    color: config.assistantMessageTextColor,
                  }}
                >
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Block */}
          <div className="chat-input-block">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="chat-input"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="send-btn"
              style={{ backgroundColor: config.color }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
