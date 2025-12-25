import React from 'react'
import { FiEdit, FiSun, FiExternalLink, FiLogOut, FiX } from 'react-icons/fi'
import { IoChatbubbleOutline } from 'react-icons/io5'
import { FaGithub } from 'react-icons/fa'

const ChatSidebar = ({ previousChats, activeChatId, onNewChat, onSelectChat, onLogout, isOpen, onClose }) => {
  return (
    <aside className={`chat-sidebar ${isOpen ? 'chat-sidebar-open' : ''}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose}>
        <FiX size={20} />
      </button>

      {/* Top - new chat */}
      <nav className="sidebar-nav">
        <button className="sidebar-nav-item" type="button" onClick={onNewChat}>
          <FiEdit size={16} className="sidebar-icon" />
          <span>New Chat</span>
        </button>
      </nav>

      {/* Chats section */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Your chats</span>
        <div className="chat-list">
          {previousChats.map((chat) => (
            <button
              key={chat.id}
              className={`chat-list-item ${
                chat.id === activeChatId ? 'chat-list-item-active' : ''
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <IoChatbubbleOutline size={14} className="chat-icon" />
              <span className="chat-title">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom quick actions */}
      <div className="sidebar-footer">
        <button className="sidebar-footer-item" type="button">
          <FiSun size={16} className="sidebar-icon" />
          <span>Light mode</span>
        </button>
        <button className="sidebar-footer-item" type="button" onClick={() => window.open('https://github.com/pankajsharma81/QuickGPT', '_blank')}>
          <FaGithub size={16} className="sidebar-icon" />
          <span>GitHub</span>
        </button>
        <button className="sidebar-footer-item" type="button">
          <FiExternalLink size={16} className="sidebar-icon" />
          <span>Updates &amp; FAQ</span>
        </button>
        <button className="sidebar-footer-item" type="button" onClick={onLogout}>
          <FiLogOut size={16} className="sidebar-icon" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

export default ChatSidebar
