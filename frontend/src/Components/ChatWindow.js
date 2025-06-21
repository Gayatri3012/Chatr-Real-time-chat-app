import EmojiPicker from 'emoji-picker-react';
import styles from '../styles/Chat.module.css'
import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import { useAppContext } from '../context';
import { toast } from 'react-toastify';

const ChatWindow= () => {
    const { username, socket, theme, chatContent, setChatContent } = useAppContext();
    const [message, setMessage] = useState('');

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    const chatWindowRef = useRef(null);

    // Scroll to bottom on new message
    useEffect(() => {
        chatWindowRef.current?.scrollTo(0, chatWindowRef.current.scrollHeight);
    }, [chatContent]);
  
    useEffect(() => {
      if (!socket) return;
  
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
  
  
        if (data.type === 'message') {
            setChatContent((prev) => [...prev, data]);
        }
      };
  
      return () => {
        socket.close();
      };
    }, [socket]);


    const handleMessageSend = (event) => {
        event.preventDefault()
        
        if(showEmojiPicker) setShowEmojiPicker(prev => !prev)

        if (!message.trim()) {
            toast.error('Cannot send empty message.')
            return
        };
        if (socket?.readyState !== WebSocket.OPEN) {
            toast.error('You are disconnected. Please refresh to reconnect.');
            return;
          }

        const msgObj = {
            type: 'message',
            message: message.trim(),
        };
        socket.send(JSON.stringify(msgObj));
        setMessage('');
    }

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
    }



    return (<section className={styles.chatWindow}>
        <section className={styles.messages} ref={chatWindowRef}>

            {chatContent.length > 0 && chatContent.map((message, index) => {
               return <Message key={index} message={message}/>
            })}

            {(Array.isArray(chatContent) && chatContent?.length === 0) && <p>No messages yet.</p>}
         
        </section> 
       
        <section className={styles.sendMessage}> 
            <div className={`${styles.emojiPickerWrapper} ${showEmojiPicker ? styles.show : styles.hide}`}>
                <EmojiPicker onEmojiClick={handleEmojiClick} height={400} width={400} theme={theme} />
            </div>
            
            <form onSubmit={handleMessageSend} className={styles.messageInput}>
            
            <button type='button' className={styles.emojiPickerButton} onClick={() => setShowEmojiPicker(prev => !prev)}>
                <img src='/emoji.png' alt='Emoji icon'/>
            </button>
            
                <input type='text' 
                value={message} 
                placeholder='Write a message...'
                onChange={(e) => setMessage(e.target.value)}
                />
                <button  type="submit">
                    <img src='/send.png' />
                </button>
            </form>
        </section>
    </section>)
}

export default ChatWindow;