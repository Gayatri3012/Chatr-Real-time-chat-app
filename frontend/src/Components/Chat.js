import ChatWindow from "./ChatWindow";
import Header from "./Header";
import styles from '../styles/Chat.module.css'

const Chat= () => {

  return (
      // Main chat container – includes the header and the chat messages window
    <section className={styles.chatContainer}>
      {/* Top section with app title and toggle button */}
      <Header />

      {/* Where all the messages and input box are shown */}
      <ChatWindow />
    </section>
  );
}

export default Chat;