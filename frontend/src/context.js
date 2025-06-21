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
  if (savedUsername && !socket) {
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'intro', username: savedUsername, avatar  }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        setChatContent(data.messages);
        setUsername(savedUsername);
        setSocket(ws);
      }
      if (data.type === 'message') {
        setChatContent((prev) => [...prev, data]);
      }
    };

    ws.onerror = () => {
      localStorage.removeItem('username');
    };

    ws.onclose = () => {
      setSocket(null);
      setUsername('');
    };
  }
  });


  return (
    <AppContext.Provider value={{ username, setUsername, theme, setTheme, socket, setSocket, chatContent, setChatContent , avatar, setAvatar }}>
      {children}
    </AppContext.Provider>
  );
};


export const useAppContext = () => useContext(AppContext);
