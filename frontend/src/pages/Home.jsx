import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import ChatSidebar from '../components/home/ChatSidebar'
import ChatScreen from '../components/home/ChatScreen'
import { getHistory, getChats, createChat } from '../api/chatApi'
import { socket } from '../sockets/socketClient'

const Home = () => {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [previousChats, setPreviousChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [error, setError] = useState('')

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
    }

    const handleAiError = (payload) => {
      setError(
        payload?.message ||
          'QuickGPT could not process your message. Please try again.'
      )
      setIsSending(false)
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
    setUserInput('')
    setIsSending(true)
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
            error={error}
          />
        </div>
      </main>
    </div>
  )
}

export default Home