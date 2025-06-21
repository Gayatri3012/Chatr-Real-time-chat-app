import { useAppContext } from "../context";
import styles from '../styles/Chat.module.css';
import ModeToggleButton from "./ModeToggle";



const Header = () => {

  const {username, socket ,setSocket, setUsername, setChatContent, avatar, setAvatar } = useAppContext();
  const handleClose = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close(); 
    }
  
    localStorage.removeItem('username'); 
    localStorage.removeItem('avatar'); 
    setUsername('');                   
    setSocket(null);      
    setChatContent([]);
    setAvatar('🐱');             
  };

  return (<header className={styles.Header}>
    <h2><span>{avatar || '🐱'}</span>  {username}</h2>
    <div>
      <ModeToggleButton />
      <button onClick={handleClose} className={styles.cancelButton}>Close</button>
    </div>

  </header>
   
  );
}

export default Header;