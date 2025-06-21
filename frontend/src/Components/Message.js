import styles from  '../styles/Chat.module.css'
import { useAppContext } from '../context';


//format timestamp
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


    // Show only time if it's today
    if (isToday) {
        return messageDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, 
        });

    // Show date + time if it's this year
    } else if(isThisYear) {

        return messageDate.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

     // Show full date and time if it's from another year
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

    return (
        <section className={`${styles.message} ${username === message.username ? styles.sent : styles.received}`}>
            {/* Show username and avatar */}
            <div className="messageUsername">
                <p className={styles.messageUsername}><span>{message.avatar || '🐱'}</span> {message.username}</p>
            </div>

            {/* Message content */}
            <p className={styles.messageContent}>{message.message}</p>

            {/* Timestamp */}
            <p className={styles.messageTime}>{date}</p>
        </section>
    )
} 

export default Message;