import React from 'react'
import styles from './start-button.css'

export default function StartButton(props) {
  return (
    <button {...props} className={styles.button}>▶️ Start</button>
  )
}
