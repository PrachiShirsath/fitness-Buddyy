import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./ChatPage.css";

const QUICK_PROMPTS = [
  { icon: "🏋️", text: "Suggest a beginner home workout" },
  { icon: "🥗", text: "What should I eat for breakfast?" },
  { icon: "⚡", text: "Motivate me to exercise today" },
  { icon: "💤", text: "How can I improve my sleep for recovery?" },
  { icon: "🔥", text: "How to lose belly fat effectively?" },
  { icon: "🧘", text: "Give me a stress-relief routine" },
];

function TypingDots() {
  return (
    <div className="typing-indicator">
      <div className="typing-dot" style={{ animationDelay: "0ms" }} />
      <div className="typing-dot" style={{ animationDelay: "160ms" }} />
      <div className="typing-dot" style={{ animationDelay: "320ms" }} />
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`message-row ${isUser ? "user" : "ai"}`} style={{ animation: "fadeIn 0.3s ease" }}>
      {!isUser && <div className="avatar ai-avatar">💪</div>}
      <div className={`bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
        <div className="markdown">
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
        {msg.timestamp && (
          <div className="msg-time">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
      {isUser && <div className="avatar user-avatar">👤</div>}
    </div>
  );
}

export default function ChatPage({ userProfile }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `# 👋 Hey there! I'm Fitness Buddy!

I'm your **AI-powered personal health & fitness coach**, here to help you:

- 🏋️ **Get personalized workout plans** tailored to your level & goals
- 🥗 **Discover nutritious meal ideas** that fit your lifestyle
- ⚡ **Stay motivated** with daily tips and inspiration
- 📅 **Build healthy habits** that actually stick

**To get the most out of our sessions**, fill in your profile in the sidebar (fitness level, goals, dietary preference).

**How can I help you today?** Ask me anything about fitness, nutrition, or healthy living!`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const userMsg = { role: "user", content: userText, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    // Maintain conversation history (last 10 turns to avoid token overflow)
    const history = historyRef.current.slice(-10);

    try {
      const { data } = await axios.post("/api/chat", {
        message: userText,
        conversationHistory: history,
        userProfile,
      });

      const aiMsg = { role: "assistant", content: data.response, timestamp: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
      historyRef.current = [...history, { role: "user", content: userText }, { role: "assistant", content: data.response }];
    } catch (err) {
      const status = err.response?.status;
      const errMsg = err.response?.data?.error || "Something went wrong. Please try again.";
      const hint = err.response?.data?.hint;
      // 429 rate limit — show as a friendly inline message instead of error banner
      if (status === 429) {
        const retryMsg = { role: "assistant", content: "⏳ IBM Granite is a little busy right now (free tier limit). Please wait 5–10 seconds and try again!", timestamp: Date.now() };
        setMessages((prev) => [...prev, retryMsg]);
      } else {
        setError(hint ? `${errMsg} — ${hint}` : errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! Ready to help you with your fitness journey. What would you like to know?",
        timestamp: Date.now(),
      },
    ]);
    historyRef.current = [];
    setError("");
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">💪</div>
          <div>
            <div className="chat-title">Fitness Buddy</div>
            <div className="chat-status">
              <span className="status-dot" />
              AI Coach · IBM Granite
            </div>
          </div>
        </div>
        <button className="clear-btn" onClick={clearChat} title="Clear chat">
          🗑️ Clear
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}

        {loading && (
          <div className="message-row ai" style={{ animation: "fadeIn 0.3s ease" }}>
            <div className="avatar ai-avatar">💪</div>
            <div className="bubble ai-bubble">
              <TypingDots />
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts — show only when just the welcome message */}
      {messages.length === 1 && (
        <div className="quick-prompts">
          <div className="quick-prompts-label">Quick Start:</div>
          <div className="quick-grid">
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} className="quick-btn" onClick={() => sendMessage(p.text)}>
                <span>{p.icon}</span> {p.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about workouts, meals, motivation..."
            rows={1}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>
        <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );
}
