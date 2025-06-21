import { useAppContext } from "../context";
import styles from '../styles/Chat.module.css';
import ModeToggleButton from "./ModeToggle";



const Header = () => {

  const {username, socket ,setSocket, setUsername, setChatContent, avatar, setAvatar } = useAppContext();

  // Handle disconnect and cleanup
  const handleClose = () => {
    // Close the WebSocket connection if it's open
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close(); 
    }
  
    // Clear local storage and context
    localStorage.removeItem('username'); 
    localStorage.removeItem('avatar'); 
    setUsername('');                   
    setSocket(null);      
    setChatContent([]);
    setAvatar('🐱');   // Reset to default avatar          
  };

  return (<header className={styles.Header}>
     {/* Show the user’s avatar and username */}
    <h2><span>{avatar || '🐱'}</span>  {username}</h2>
    <div>
       {/* Toggle for light/dark mode */}
      <ModeToggleButton />

      {/* Close button to leave the chat */}
      <button onClick={handleClose} className={styles.cancelButton}>Close</button>
    </div>

  </header>
   
  );
}

export default Header;