import React from 'react'
import { RiRobot2Line } from 'react-icons/ri'
import { FiMenu, FiSun, FiZap, FiAlertTriangle, FiInfo, FiSettings } from 'react-icons/fi'
import ChatMessages from './ChatMessages'
import ChatInputBar from './ChatInputBar'

const ChatScreen = ({ messages, userInput, isSending, onChangeInput, onSend, onMenuClick, error }) => {
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
            <span className="chat-title-name">QuickGPT Conversation</span>
            <div className="chat-header-actions">
              <button className="chat-header-icon" type="button" aria-label="Conversation info">
                <FiInfo size={16} />
              </button>
              <button className="chat-header-icon" type="button" aria-label="Settings">
                <FiSettings size={16} />
              </button>
            </div>
          </header>
          <ChatMessages messages={messages} />
        </>
      ) : (
        // Landing view - QuickGPT start screen
        <div className="welcome-view">
          <div className="start-panel">
            <div className="start-header">
              <div className="start-logo-circle">
                <RiRobot2Line size={32} />
              </div>
              <h1 className="start-title">QuickGPT</h1>
            </div>

            <div className="start-grid">
              <div className="start-column">
                <div className="start-column-header">
                  <span className="start-icon">
                    <FiSun size={16} />
                  </span>
                  <span className="start-column-title">Examples</span>
                </div>
                <div className="start-cards">
                  <button className="start-card" type="button">
                    "Explain quantum computing in simple terms"
                  </button>
                  <button className="start-card" type="button">
                    "Give me creative ideas for a birthday surprise"
                  </button>
                  <button className="start-card" type="button">
                    "How to make an HTTP request in JavaScript?"
                  </button>
                </div>
              </div>

              <div className="start-column">
                <div className="start-column-header">
                  <span className="start-icon">
                    <FiZap size={16} />
                  </span>
                  <span className="start-column-title">Capabilities</span>
                </div>
                <div className="start-cards">
                  <button className="start-card start-card-text" type="button">
                    Remembers previous messages
                  </button>
                  <button className="start-card start-card-text" type="button">
                    Accepts follow-up corrections
                  </button>
                  <button className="start-card start-card-text" type="button">
                    Trained to decline inappropriate requests
                  </button>
                </div>
              </div>

              <div className="start-column">
                <div className="start-column-header">
                  <span className="start-icon">
                    <FiAlertTriangle size={16} />
                  </span>
                  <span className="start-column-title">Limitations</span>
                </div>
                <div className="start-cards">
                  <button className="start-card start-card-text" type="button">
                    May sometimes provide inaccurate info
                  </button>
                  <button className="start-card start-card-text" type="button">
                    May generate biased or sensitive content
                  </button>
                  <button className="start-card start-card-text" type="button">
                    Limited knowledge of very recent events
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="chat-error-banner">
          {error}
        </div>
      )}
      <ChatInputBar
        userInput={userInput}
        isSending={isSending}
        onChange={onChangeInput}
        onSubmit={onSend}
        placeholder="Send a message to AI…"
      />
    </section>
  )
}

export default ChatScreen
