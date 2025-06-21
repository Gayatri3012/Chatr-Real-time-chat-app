import { useEffect, useState } from "react";
import { useAppContext } from "../context";
import ModeToggleButton from "./ModeToggle";
import styles from '../styles/WelcomeUser.module.css';
import { MessageSquareMore } from "lucide-react";
import { toast } from "react-toastify";


const WelcomeUser = () => {

    const [input, setInput] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('🧑‍💻');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { setUsername ,setSocket, setChatContent, setAvatar  } = useAppContext();

    // Load saved username and avatar from localStorage (if available)
    useEffect(() => {
      const stored = localStorage.getItem('username');
      const storedAvatar = localStorage.getItem('avatar');
      if (stored) setInput(stored);
      if (storedAvatar) setSelectedAvatar(storedAvatar);
    }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    setError('')
    const trimmed = input.trim();
    
    if (!trimmed || loading){ 
      setError('Username cannot be empty.')
      return
    };
    // Check internet connection before trying to connect
    if (!navigator.onLine) {
      setError("You are offline. Please check your connection.");
      return;
    }
    
    setLoading(true);
  
    // Create WebSocket connection
    const ws = new WebSocket('wss://chatr-real-time-chat-app.onrender.com/');
    let errorHandled = false;

    // When connection is open, send intro message with username and avatar
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'intro', username: trimmed, avatar: selectedAvatar }));
    };
      

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
    
        // If username is already taken
        if (data.type === 'error') {
          setError(data.message); 
          errorHandled = true; 
          ws.close(); 
          setLoading(false);
          return;
        }
    
        // If connection is successful, store user and chat data
        if (data.type === 'history') {
          localStorage.setItem('username', trimmed); 
          localStorage.setItem('avatar', selectedAvatar);
          setUsername(trimmed);
          setAvatar(selectedAvatar);
          setSocket(ws);
          setChatContent(data.messages);
          setLoading(false);
        }
      };
    
      // Handle connection error
      ws.onerror = (err) => {
        setError('Failed to connect to server.');
        toast.error('Failed to connect to server.');
        errorHandled = true; 
        setLoading(false);
      };

      // Show toast only if error wasn't already shown
      ws.onclose = () => {
        if (!errorHandled) {
          toast.info('Disconnected from server.');
        }
        setLoading(false);
      };
  };

  // Handle avatar selection
  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    localStorage.setItem('avatar', avatar);
  };

  // List of emojis user can choose from
  const avatarList = [ '👨🏻', '👩🏻', '🐱', '🐶', '🦊', '🐵', '👽'];
 

  return (<>
  <div className={styles.modeToggleDiv} >
         <ModeToggleButton />
  </div>
  <MessageSquareMore size={30} />
  <h2>Welcome to <span style={{ color: '#3C83F5' }}>Chatr</span> a Real-Time Chat Application</h2>
  <p>Enter your username to join the conversation.</p>
   <form onSubmit={handleSubmit}className={styles.welcomeUserform}>
   
     {error && <p className={styles.errorText}>{error}</p>}
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          if (error) setError('');
          if (loading) setLoading(false);
        }}
        placeholder="Username"
        className={error ? styles.error : ""}
        required
      />
      
      {/* Avatar Selection UI */}
      <>
      <label>Select your avatar:</label>
      <div className={styles.avatarList}>
        {avatarList.map((avatar, index) => (
          <span
            key={index}
            className={`${styles.avatarOption} ${avatar === selectedAvatar ? styles.selected : ''}`}
            onClick={() => handleAvatarClick(avatar)}
          >
            {avatar}
          </span>
        ))}
      </div>
    </>
 
      <button type="submit" disabled={loading}       
        style={{
            padding: '10px 20px',
            backgroundColor: '#3C83F5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
        }}
      > {loading ? 'Joining...' : 'Join Chat'}</button>
    </form>
  </>
   
  );
}

export default WelcomeUser;