import React from 'react'
import { RiRobot2Line } from 'react-icons/ri'
import { HiOutlineUser } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'

const ChatMessages = ({ messages, isGenerating = false }) => {
  const formatTime = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-messages">
      {messages.map((msg) => {
        const isUser = msg.sender === 'user'
        const time = formatTime(msg.timestamp || msg.createdAt)

        return (
          <div
            key={msg.id}
            className={`chat-message-row ${isUser ? 'chat-message-user' : 'chat-message-ai'}`}
          >
            {!isUser && (
              <div className="chat-avatar chat-avatar-ai">
                <RiRobot2Line size={18} />
              </div>
            )}

            <div className="chat-bubble-wrapper">
              <div className="chat-message-bubble">
                {isUser ? (
                  msg.text
                ) : (
                  <div>
                    <ReactMarkdown>
                      {msg.text || ''}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              {time && (
                <div className="chat-message-meta">{time}</div>
              )}
            </div>

            {isUser && (
              <div className="chat-avatar chat-avatar-user">
                <HiOutlineUser size={18} />
              </div>
            )}
          </div>
        )
      })}

      {isGenerating && (
        <div className="chat-message-row chat-message-ai">
          <div className="chat-avatar chat-avatar-ai">
            <RiRobot2Line size={18} />
          </div>
          <div className="chat-bubble-wrapper">
            <div className="chat-message-bubble typing-bubble">
              <div className="typing-indicator">
                <span className="typing-dots">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </span>
                <span className="typing-text">Generating...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatMessages
