import React from 'react'

const ChatMessages = ({ messages }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-message chat-message-${msg.sender}`}
        >
          <div className="chat-message-bubble">{msg.text}</div>
        </div>
      ))}
    </div>
  )
}

export default ChatMessages
