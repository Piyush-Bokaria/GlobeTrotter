import React, { useState, useRef, useEffect } from "react";

const rules = [
  {
    patterns: [/hi/i, /hello/i, /hey/i],
    responses: ["Hello! How can I assist you with your travel plans today?"],
  },
  {
    patterns: [/plan a trip/i, /create trip/i],
    responses: [
      "To plan a trip, click on the 'Plan a Trip' button above or visit the Create Trip page.",
    ],
  },
  {
    patterns: [/budget/i, /cost/i, /price/i],
    responses: [
      "You can track your trip budget and expenses on the Dashboard and within each trip's details.",
    ],
  },
  {
    patterns: [/help/i, /support/i],
    responses: [
      "I’m here to help! Ask me about trips, itineraries, or how to use the app features.",
    ],
  },
  {
    patterns: [/default/i],
    responses: [
      "Sorry, I did not understand. You can ask about planning trips, budgets, or your itinerary.",
    ],
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your travel assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const getResponse = (inputText) => {
    for (let rule of rules) {
      if (rule.patterns.some((pattern) => pattern.test(inputText))) {
        const res = rule.responses[Math.floor(Math.random() * rule.responses.length)];
        return res;
      }
    }
    // Default fallback
    return rules[rules.length - 1].responses[0];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const botReply = { from: "bot", text: getResponse(input) };
    setTimeout(() => {
      setMessages((prev) => [...prev, botReply]);
    }, 700);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        type="button"
        className="btn btn-primary chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        <i className="bi bi-chat-dots-fill"></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window shadow rounded">
          <div className="chatbot-header d-flex justify-content-between align-items-center p-2 bg-primary text-white rounded-top">
            <span>Travel Assistant</span>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
          <div className="chatbot-messages p-2" style={{ height: "300px", overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message mb-2 ${
                  msg.from === "bot" ? "text-start" : "text-end"
                }`}
              >
                <div
                  className={`d-inline-block p-2 rounded ${
                    msg.from === "bot" ? "bg-light" : "bg-primary text-white"
                  }`}
                  style={{ maxWidth: "80%" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input p-2 border-top">
            <textarea
              className="form-control"
              rows={1}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary mt-1 w-100" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Chatbot CSS */}
      <style jsx>{`
        .chatbot-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          font-size: 1.5rem;
          z-index: 1050;
        }
        .chatbot-window {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 320px;
          background: white;
          display: flex;
          flex-direction: column;
          z-index: 1050;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .chatbot-header {
          font-weight: 600;
          font-size: 1.1rem;
        }
        .chatbot-messages {
          background: #f9f9f9;
          flex-grow: 1;
        }
        .chatbot-message {
          padding: 0 5px;
        }
        .chatbot-input textarea {
          resize: none;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
