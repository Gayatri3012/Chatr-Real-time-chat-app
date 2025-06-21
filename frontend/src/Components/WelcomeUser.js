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
    if (!navigator.onLine) {
      setError("You are offline. Please check your connection.");
      return;
    }
    
    setLoading(true);
  
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:5000');
    let errorHandled = false;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'intro', username: trimmed, avatar: selectedAvatar }));
      };
      

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
    
        if (data.type === 'error') {
          setError(data.message); 
          errorHandled = true; 
          ws.close(); 
          setLoading(false);
          return;
        }
    
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
    
      ws.onerror = (err) => {
        setError('Failed to connect to server.');
        toast.error('Failed to connect to server.');
        errorHandled = true; 
        setLoading(false);
      };

      ws.onclose = () => {
        if (!errorHandled) {
          toast.info('Disconnected from server.');
        }
        setLoading(false);
      };
  };

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    localStorage.setItem('avatar', avatar); // Optional: persist
  };
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