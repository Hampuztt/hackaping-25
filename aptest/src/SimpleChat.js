import React, { useEffect, useRef, useState } from "react";
import './SimpleChat.css';



const SimpleChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const cont= useRef(null);
  
    const handleSend = () => {
      if (input.trim() === '') return;
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    };

    useEffect(() => {
        const container = cont.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, [messages]);
  
    return (
      <div className="chat-container">
        <div className="chat-messages">
        <div className="chat-holder" ref={cont}>
                {messages.map((msg, index) => (
                    !(index % 2)  ? (
                        <div key={index} 
                        className="chat-message">
                        <span className="chat-sender"></span> {msg.text}
                        </div>
                    ) : (
                        <div key={index} 
                        className="chat-bot">
                        <span className="chat-sender"></span> {msg.text}
                        </div>
                    ) 
                ))}
            </div>
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="chat-input"
            placeholder="Type a message..."
          />
          <button onClick={handleSend} className="chat-send-button">
            &gt;
          </button>
        </div>
      </div>
    );
  };
  
  export default SimpleChat;