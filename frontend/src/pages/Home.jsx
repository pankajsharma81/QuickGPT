import React, { useState } from 'react'
import '../styles/Home.css'
import ChatSidebar from '../components/home/ChatSidebar'
import ChatScreen from '../components/home/ChatScreen'

const Home = () => {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [previousChats, setPreviousChats] = useState([
    { id: 'chat-1', title: 'Welcome chat' }
  ])
  const [activeChatId, setActiveChatId] = useState('chat-1')
  const [isSending, setIsSending] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const trimmed = userInput.trim()
    if (!trimmed || isSending) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed
    }

    setMessages((prev) => [...prev, userMessage])
    setUserInput('')
    setIsSending(true)

    try {
      // TODO: replace this with real API call to your backend
      // Example:
      // const res = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: trimmed, chatId: activeChatId })
      // })
      // const data = await res.json()
      // const aiText = data?.reply || 'Something went wrong, please try again.'

      const fakeAiReply = `You said: "${trimmed}"`

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: fakeAiReply
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch {
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'ai',
        text: 'Sorry, something went wrong. Please try again.'
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`
    const newChat = {
      id: newId,
      title: 'New chat'
    }
    setPreviousChats((prev) => [newChat, ...prev])
    setActiveChatId(newId)
    setMessages([])
  }

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId)
    // In a real app you would load this chat's messages from backend here
    setMessages([])
  }

  return (
    <div className="home-container">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main chat layout */}
      <main className="home-main">
        <div className="chat-layout">
          <ChatSidebar
            previousChats={previousChats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSelectChat={(chatId) => {
              handleSelectChat(chatId)
              setIsSidebarOpen(false)
            }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <ChatScreen
            messages={messages}
            userInput={userInput}
            isSending={isSending}
            onChangeInput={setUserInput}
            onSend={handleSendMessage}
            onMenuClick={toggleSidebar}
          />
        </div>
      </main>
    </div>
  )
}

export default Home