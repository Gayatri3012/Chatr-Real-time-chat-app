import { Sun, Moon } from "lucide-react";
import { useAppContext } from "../context";

import styles from '../styles/Chat.module.css'

export default function ModeToggleButton() {

    const {theme, setTheme} = useAppContext();

    function toggleTheme(){
        setTheme(prev => prev==='light'? 'dark' : 'light');        
    }
    
    return (
        <button id="themeButton" className={styles.modeToggleButton}  onClick={toggleTheme}>
            {theme==='dark' ?  <Sun size={20} color="#faf089" /> :  <Moon size={20} color="#718096"/>}
        </button>
    )
}