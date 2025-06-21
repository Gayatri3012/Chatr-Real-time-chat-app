import { useAppContext } from "../context";
import ChatWindow from "./ChatWindow";
import Header from "./Header";
import styles from '../styles/Chat.module.css'

const Chat= () => {

    const {username} = useAppContext();
  return (<section className={styles.chatContainer}>
    <Header />
    <ChatWindow />
    </section>
  );
}

export default Chat;