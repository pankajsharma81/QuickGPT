import React from 'react'
import { RiRobot2Line } from 'react-icons/ri'
import { FiMenu } from 'react-icons/fi'
import ChatMessages from './ChatMessages'
import ChatInputBar from './ChatInputBar'

const ChatScreen = ({ messages, userInput, isSending, onChangeInput, onSend, onMenuClick }) => {
  const hasMessages = messages.length > 0

  return (
    <section className="chat-screen">
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <FiMenu size={20} />
      </button>

      {hasMessages ? (
        // Chat view with messages
        <>
          <header className="chat-screen-header">
            <span className="chat-title-name">QuickGPT</span>
          </header>
          <ChatMessages messages={messages} />
        </>
      ) : (
        // Welcome view - empty state
        <div className="welcome-view">
          <div className="welcome-logo">
            <RiRobot2Line size={48} />
          </div>
          <h1 className="welcome-title">QuickGPT</h1>
        </div>
      )}
      <ChatInputBar
        userInput={userInput}
        isSending={isSending}
        onChange={onChangeInput}
        onSubmit={onSend}
        placeholder={hasMessages ? "How can QuickGPT help?" : "What do you want to know?"}
      />
    </section>
  )
}

export default ChatScreen
