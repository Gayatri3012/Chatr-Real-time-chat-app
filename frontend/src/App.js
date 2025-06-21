import WelcomeUser from './Components/WelcomeUser';
import './styles/App.css';
import { useAppContext } from './context';
import Chat from './Components/Chat';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const { theme , username, socket} = useAppContext();

  useEffect(() => {
    // Apply the current theme to the body whenever it changes
    document.body.className = theme; 
  }, [theme]);
  


  return (
    <div className="App">
        <ToastContainer 
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme={theme} 
      />
      {/* If user has joined and socket is active, show chat UI. Otherwise, show join screen */}
        {username && socket ? <Chat/> : <WelcomeUser/>}
    </div>
  );
}

export default App;
