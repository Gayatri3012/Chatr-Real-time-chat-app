# 💬 Chatr -  Real-Time Chat Application using MERN Stack

A real-time chat application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with WebSocket communication using the `ws` module. Users can join with a username and avatar, send messages, and receive them in real time. The chat supports multiple users and stores messages in a MongoDB database.

---

## 🚀 Features

- Real-time chat functionality using WebSocket (`ws` module)
- Persistent chat history (last 50 messages) displayed to new users upon joining
- Avatar selection during user onboarding for personalization
- Dynamic handling of user join and disconnect events
- Light and Dark theme toggle for enhanced user experience
- Robust error handling (e.g., network issues, duplicate usernames)
- User-friendly toast notifications for system feedback
---

## 📦 Tech Stack

- **Frontend**: React.js, Toastify(for Notifications)
- **Backend**: Node.js, Express.js
- **WebSockets**: `ws`
- **Database**: MongoDB (via Mongoose)

---

## 📁 Project Structure

```bash
.
├── backend
│   ├── models
│   │   └── Message.js
│   ├── websocket.js
│   └── index.js
├── frontend
│   ├── src
│   │   ├── components
│   │   │    ├── Chat.js
│   │   │    └── Message.js
│   │   ├── context
│   │   ├── App.jsx
│   │   └── index.css
├── README.md
```

---

## 🔧 Local Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/Gayatri3012/Chatr-Real-time-chat-app.git
cd Chatr-Real-time-chat-app
```

---

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add your MongoDB URI:

```
MONGO_URI=your_mongo_connection_string
PORT=5000
```

4. Start the backend server:

```bash
node server.js
```

> This starts an Express server and WebSocket server on `ws://localhost:5000`.

---

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

> The app will be available at `http://localhost:3000`.

---

## Architecture Overview

### Backend

- Built with **Node.js** and **Express.js**.
- WebSocket server powered by the native `ws` module.
- MongoDB used to persist chat messages, handled through **Mongoose**.
- On client connection:
  - Accepts a username and avatar.
  - Sends back the most recent 50 messages from the database.
  - Broadcasts system messages and user messages to all connected clients.
- Rejects duplicate usernames to avoid conflicts.

###  Frontend

- Built with **React.js** as a Single Page Application (SPA).
- Uses the browser's native WebSocket API for real-time communication.
- Global state is managed using **React Context API**:
  - Stores `username`, `socket`, `avatar`, `chatContent`, and `theme`.
- Features include:
  - Username and avatar selection screen.
  - Chat interface with message bubbles, avatars, timestamps.
  - Real-time UI updates on receiving messages.
  - Auto scroll-to-bottom on new messages.
  - Toast notifications (via **React Toastify**).

###  WebSocket Communication Flow

1. Client connects and sends an `intro` message with `username` and `avatar`.
2. Server sends chat history and system notifications.
3. Messages sent from client:
   - Are saved in MongoDB.
   - Are broadcast to all connected clients.

### Concurrency Handling

- Each WebSocket client is managed asynchronously using `async/await`.
- All message sends, history fetches, and broadcasts are non-blocking.
- Clean disconnection logic removes inactive users and prevents memory leaks.

### Message Lifecycle Overview

```text
User types → message sent via WebSocket → backend saves it in DB → backend broadcasts → all clients update chat UI
```

---

## 🧠 Assumptions and Design Choices

- WebSocket `ws` module is used (not Socket.IO) as per requirements.
- Username must be unique for each active session.
- Avatars are chosen from a predefined emoji list.
- Only essential fields are stored: `username`, `message`, `timestamp`, `avatar`
- Only the last 50 messages are shown on reconnect.
- Auto reconnection is not implemented to keep logic simple.
- Minimalist UI for speed and simplicity.

---

## 🌐 Deployed Application

- **Frontend**: [Vercel Link](https://chatr-real-time-chat-app.vercel.app/)
- **Backend**: [Render Link](https://chatr-real-time-chat-app.onrender.com)

> 💡 Note: The backend may take 30–60 seconds to wake up cause it's hosted on Render (due to free-tier idling).

## Author

> Gayatri Takawale  
> GitHub: [github.com/Gayatri3012](https://github.com/Gayatri3012)


---
