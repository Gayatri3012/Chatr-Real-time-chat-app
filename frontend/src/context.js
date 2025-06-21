import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('light');
  const [chatContent, setChatContent] = useState([]);
  const [socket, setSocket] = useState(null);
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '🐱');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');

    // If there's already a saved username and no socket connection, try reconnecting
    if (savedUsername && !socket) {
      const ws = new WebSocket('wss://chatr-real-time-chat-app.onrender.com/');

      // Once connected, send intro with username and avatar
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'intro', username: savedUsername, avatar  }));
      };

      // Handle incoming messages from the server
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'history') {
          setChatContent(data.messages);
          setUsername(savedUsername);
          setSocket(ws);
        }

         // New chat message received
        if (data.type === 'message') {
          setChatContent((prev) => [...prev, data]);
        }
      };

      // In case of any socket error, remove the saved username to avoid broken state
      ws.onerror = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('avatar');
      };

      // On disconnection, clean up socket and username from state
      ws.onclose = () => {
        setSocket(null);
        setUsername('');
        setAvatar('🐱')
        setTheme('light')
      };
    }
  });


  // Wrapping the entire app with context so all components can use these states
  return (
    <AppContext.Provider value={{ username, setUsername, theme, setTheme, socket, setSocket, chatContent, setChatContent , avatar, setAvatar }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context easily in other components
export const useAppContext = () => useContext(AppContext);
