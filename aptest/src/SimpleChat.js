import React, { useEffect, useRef, useState } from "react";
import './SimpleChat.css';

function linkify(text) {
  const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
}

const SimpleChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const cont= useRef(null);

    const [isWaiting, setIsWaiting] = useState(false);
    const [isResponding, setIsResponding] = useState(false);
    const [question, setQuestion] = useState('');
  
    const handleSend = async ()  => {
      console.log(isWaiting);

      if (isWaiting){
        setIsResponding(true);
        try{
          console.log(question);

          const response = await fetch("http://localhost:3002/get-response", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input:  question}),
          });

          console.log(response);
          const data = await response.json();

          const responseText = data.response;
          const imageUrl = data.url;

          var text = '';
          if(imageUrl === ''){
            text = responseText;
          }
          else{
            text = responseText + '\n' + imageUrl;
          }

          setMessages([...messages, { text: text, sender: 'bot' }]);
          
          setIsWaiting(false);
          setIsResponding(false);

        } catch(error) {
          console.log(error);

          setMessages([...messages, { text: 'something went wrong', sender: 'bot' }]);
          
          setQuestion('')
          setIsWaiting(false);
          setIsResponding(false);
        }
        return;
      }

      if (input.trim() === '') return;
      setMessages([...messages, { text: input, sender: 'user' }]);
      setQuestion(input);
      setInput('');
      setIsWaiting(true);

    }
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if(isWaiting) return;
        handleSend();
      }
    };

    useEffect(() => {
      console.log('isWaiting changed:', isWaiting);
    }, [isWaiting]);

    useEffect(() => {
        const container = cont.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, [messages]);
  
    if (isWaiting && !isResponding){
      handleSend();
    }

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
          <button onClick={
            !isWaiting ?
            handleSend :
            () => {} 
            } className="chat-send-button">
            &gt;
          </button>
        </div>
      </div>
    );
  };
  
  export default SimpleChat;