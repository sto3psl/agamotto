import React, { useState, useEffect } from 'react'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import { formatTimeDifference } from './utils/time'

import styles from './running-timer.css'

function useRealTimeDuration(startDate) {
  const [duration, setState] = useState(0)

  useEffect(() => {
    const newDuration = differenceInSeconds(new Date(), startDate)
    const id = setInterval(() => {
      setState(newDuration)
      document.title = `🕐 [${formatTimeDifference(newDuration)}] Running`
    }, 500)
    return () => clearInterval(id)
  })

  return duration
}

export default function RunningTimer({ startDate, TimeFormat, onStop, onCancel }) {
  const duration = useRealTimeDuration(startDate)

  return (
    <div className={styles.container}>
      <div className={styles.time}>{formatTimeDifference(duration)}</div>
      <div className={styles.start}>⦿ {TimeFormat.format(new Date(startDate))}</div>
      <div className={styles.actions}>
        <button className={styles.button} onClick={onCancel}>
          💥 Cancel
        </button>
        <button className={styles.button} onClick={onStop}>
          ⏹ Stop & Save
        </button>
      </div>
    </div>
  )
}
