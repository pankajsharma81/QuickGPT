import React from 'react'
import { FiPaperclip } from 'react-icons/fi'
import { IoArrowUp } from 'react-icons/io5'

const ChatInputBar = ({ userInput, isSending, onChange, onSubmit, placeholder }) => {
  const disabled = isSending || !userInput.trim()

  return (
    <div className="chat-input-wrapper">
      <form className="chat-input-bar" onSubmit={onSubmit}>
        <button
          type="button"
          className="chat-icon-btn"
          aria-label="Attach file"
        >
          <FiPaperclip size={18} />
        </button>

        <input
          type="text"
          className="chat-input"
          placeholder={placeholder || "What do you want to know?"}
          value={userInput}
          onChange={(e) => onChange(e.target.value)}
        />

        <div className="chat-input-actions">
          <button
            type="submit"
            className={`chat-send-pill ${disabled ? 'chat-send-pill-disabled' : ''}`}
            disabled={disabled}
          >
            <IoArrowUp size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatInputBar
