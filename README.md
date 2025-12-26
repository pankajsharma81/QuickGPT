# 🚀 QuickGPT Backend

This is the backend API and socket server for QuickGPT, a modern conversational AI platform.

## ✨ Features

- 🔗 REST API for chat sessions, messages, and user authentication
- ⚡ Real-time chat via Socket.IO
- 🔒 JWT authentication (cookie-based)
- 🤖 AI integration (Gemini, OpenAI, etc.)
- 🗄️ MongoDB for persistent chat and user data
- ⚙️ Environment-based configuration

## 🛠️ Getting Started

### 📦 Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or cloud)
- (Optional) Gemini/OpenAI API key

### 📥 Installation

```bash
cd backend
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/quickgpt
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_gemini_api_key   # Optional, for Gemini integration
```

### ▶️ Running the Server

```bash
npm run dev
# or
npx nodemon server.js
```

### 📚 API Endpoints

- `POST /api/auth/login` – User login
- `POST /api/auth/register` – User registration
- `POST /api/auth/logout` – User logout
- `GET /api/chat/session` – List chat sessions
- `POST /api/chat/session` – Create new chat
- `GET /api/chat/history?chatId=...` – Get chat history
- `POST /api/chat` – Send message (AI response)
- Socket.IO: `/socket.io` – Real-time chat events

### 🧑‍💻 Development

- Code is organized by feature: `controllers/`, `models/`, `routes/`, `services/`, `sockets/`
- Uses ES6 modules and async/await
- Error handling and logging included

### 📄 License

MIT

---

## Frontend README (`frontend/README.md`)

````markdown
# 💬 QuickGPT Frontend

This is the frontend React app for QuickGPT, a sleek conversational AI interface.

## ✨ Features

- 🌗 Modern dark/light theme with theme toggle
- 💬 Chat UI with markdown rendering, avatars, timestamps
- ⚡ Real-time messaging via Socket.IO
- 🔗 REST API integration (Axios)
- 🔒 JWT authentication
- 📱 Responsive design for desktop and mobile
- 🗂️ Sidebar with chat sessions, GitHub link, and logout

## 🛠️ Getting Started

### 📦 Prerequisites

- Node.js (v18+ recommended)
- Backend API running (see backend README)

### 📥 Installation

```bash
cd frontend
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in the [frontend](http://_vscodecontentref_/0) directory:

```
VITE_API_URL=https://quickgpt-vsmt.onrender.com
```

### ▶️ Running the App

```bash
npm run dev
```

### 🌟 Main Features

- 🤖 Chat with QuickGPT AI in real time
- 🗂️ View and switch between multiple chat sessions
- 📝 Markdown support for AI responses
- 🌗 Theme toggle (dark/light)
- 🔒 Authentication (login/register/logout)
- 🐙 GitHub link in sidebar

### 🧑‍💻 Development

- Uses React, Tailwind CSS, Axios, Socket.IO client, React Markdown
- Organized by feature: `components/`, `api/`, `context/`, `styles/`
- Easily customizable

### 📄 License

MIT
