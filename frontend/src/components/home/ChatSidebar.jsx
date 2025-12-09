import React from 'react'
import { FiEdit, FiSearch, FiX } from 'react-icons/fi'
import { IoChatbubbleOutline } from 'react-icons/io5'
import { HiOutlineUser } from 'react-icons/hi'

const ChatSidebar = ({ previousChats, activeChatId, onNewChat, onSelectChat, isOpen, onClose }) => {
  return (
    <aside className={`chat-sidebar ${isOpen ? 'chat-sidebar-open' : ''}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose}>
        <FiX size={20} />
      </button>

      {/* Top navigation */}
      <nav className="sidebar-nav">
        <button className="sidebar-nav-item" onClick={onNewChat}>
          <FiEdit size={16} className="sidebar-icon" />
          <span>New chat</span>
        </button>
        <button className="sidebar-nav-item">
          <FiSearch size={16} className="sidebar-icon" />
          <span>Search chats</span>
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

      {/* Bottom user section */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="user-avatar">
            <HiOutlineUser size={16} />
          </span>
          <span className="user-name">User</span>
        </div>
      </div>
    </aside>
  )
}

export default ChatSidebar
