import styles from  '../styles/Chat.module.css'
import { useAppContext } from '../context';

const formatMessageTime = (createdAt) => {
    const messageDate = new Date(createdAt);
    const today = new Date();

    // console.log(messageDate, today)
    const isToday =
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear();

    const isThisYear =
        messageDate.getFullYear() === today.getFullYear();


    if (isToday) {
        return messageDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, 
        });
    } else if(isThisYear) {

        return messageDate.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } else {
        return messageDate.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
}

const Message = ({message}) => {

    const { username } = useAppContext();
    let date = formatMessageTime(message.timestamp);

    return (<section className={`${styles.message} ${username === message.username ? styles.sent : styles.received}`}>
          <div className="messageUsername">
         <p className={styles.messageUsername}><span>{message.avatar || '🐱'}</span> {message.username}</p>
      </div>
   
      <p className={styles.messageContent}>{message.message}</p>
      <p className={styles.messageTime}>{date}</p>
    </section>)
} 

export default Message;