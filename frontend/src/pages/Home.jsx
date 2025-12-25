import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import ChatSidebar from '../components/home/ChatSidebar'
import ChatScreen from '../components/home/ChatScreen'
import { getHistory, getChats, createChat } from '../api/chatApi'
import { socket } from '../sockets/socketClient'
import { logout as logoutApi } from '../api/authApi'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [previousChats, setPreviousChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const initChatsAndHistory = async () => {
      try {
        setError('')

        const chatsData = await getChats()
        const chats = Array.isArray(chatsData?.chats) ? chatsData.chats : []

        const mappedChats = chats.map((chat) => ({
          id: chat._id,
          title: chat.title || 'New chat'
        }))
        setPreviousChats(mappedChats)

        const firstChatId = mappedChats[0]?._id || mappedChats[0]?.id
        if (firstChatId) {
          setActiveChatId(firstChatId)

          const historyData = await getHistory(firstChatId)
          if (Array.isArray(historyData?.messages)) {
            const mappedMessages = historyData.messages.map((m) => ({
              id: m.id,
              sender: m.role === 'model' ? 'ai' : 'user',
              text: m.content
            }))
            setMessages(mappedMessages)
          }
        }
      } catch (err) {
        console.error('QuickGPT initial load error', err)
        setError('QuickGPT could not load your chats. Please try again.')
      }
    }

    initChatsAndHistory()
  }, [])

  useEffect(() => {
    const handleAiResponse = (payload) => {
      const aiMessage = {
        id: Date.now(),
        sender: 'ai',
        text:
          payload?.content ||
          'QuickGPT is having trouble responding right now. Please try again.'
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsSending(false)
      setIsGenerating(false)
    }

    const handleAiError = (payload) => {
      setError(
        payload?.message ||
          'QuickGPT could not process your message. Please try again.'
      )
      setIsSending(false)
      setIsGenerating(false)
    }

    socket.on('ai-response', handleAiResponse)
    socket.on('ai-error', handleAiError)

    return () => {
      socket.off('ai-response', handleAiResponse)
      socket.off('ai-error', handleAiError)
    }
  }, [])

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

    // If this is the first user prompt and the chat title is still generic,
    // update the local sidebar title immediately for a better UX.
    setPreviousChats((prev) => {
      if (!activeChatId) return prev

      const updated = prev.map((chat) => {
        if (chat.id !== activeChatId) return chat

        const currentTitle = (chat.title || '').trim()
        let nextTitle = chat.title

        if (!currentTitle || currentTitle === 'New chat') {
          nextTitle = trimmed.length > 30 ? `${trimmed.slice(0, 30)}…` : trimmed
        }

        return { ...chat, title: nextTitle }
      })

      const index = updated.findIndex((c) => c.id === activeChatId)
      if (index <= 0) return updated

      const [activeChat] = updated.splice(index, 1)
      return [activeChat, ...updated]
    })
    setUserInput('')
    setIsSending(true)
    setIsGenerating(true)
    setError('')

    try {
      socket.emit('ai-message', {
        chat: activeChatId || undefined,
        content: trimmed
      })
    } catch (err) {
      console.error('QuickGPT sendMessage error', err)
      setError('QuickGPT could not process your message. Please try again.')
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'ai',
        text: 'Sorry, something went wrong. Please try again.'
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
      setIsGenerating(false)
    }
  }

  const handleNewChat = () => {
    const create = async () => {
      try {
        setError('')
        const data = await createChat('New chat')
        const chat = data?.chat
        if (!chat?._id) return

        const newChat = {
          id: chat._id,
          title: chat.title || 'New chat'
        }

        setPreviousChats((prev) => [newChat, ...prev])
        setActiveChatId(newChat.id)
        setMessages([])
      } catch (err) {
        console.error('QuickGPT createChat error', err)
        setError('QuickGPT could not create a new chat. Please try again.')
      }
    }

    create()
  }

  const handleLogout = async () => {
    try {
      setError('')
      await logoutApi()
    } catch (err) {
      console.error('QuickGPT logout error', err)
    } finally {
      // Clear any client-side auth remnants and go to login
      localStorage.removeItem('quickgpt_token')
      navigate('/login')
    }
  }

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId)
    setMessages([])

    const loadHistoryForChat = async () => {
      try {
        setError('')
        const data = await getHistory(chatId)
        if (Array.isArray(data?.messages)) {
          const mapped = data.messages.map((m) => ({
            id: m.id,
            sender: m.role === 'model' ? 'ai' : 'user',
            text: m.content
          }))
          setMessages(mapped)
        }
      } catch (err) {
        console.error('QuickGPT getHistory error', err)
        setError('QuickGPT could not load this chat history.')
      }
    }

    loadHistoryForChat()
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
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <ChatScreen
            messages={messages}
            userInput={userInput}
            isSending={isSending}
            isGenerating={isGenerating}
            onChangeInput={setUserInput}
            onSend={handleSendMessage}
            onMenuClick={toggleSidebar}
            error={error}
          />
        </div>
      </main>
    </div>
  )
}

export default Home