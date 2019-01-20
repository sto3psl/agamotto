import React from 'react'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import { formatTimeDifference } from './utils/time'

import styles from './list-item.css'

export default function ListItem({ startDate, stopDate, _id, DateFormat, TimeFormat, onDelete }) {
  startDate = new Date(startDate)
  const duration = differenceInSeconds(stopDate, startDate)
  return (
    <div className={styles.container}>
      <div className={styles.duration}>
        <div>{formatTimeDifference(duration)}</div>
        <button className={styles.delete} onClick={onDelete}>💥</button>
      </div>
      <div className={styles.date}>
        <span>{TimeFormat.format(startDate)} Uhr</span>
        {' - '}
        <span>{DateFormat.format(startDate)}</span>
      </div>
    </div>
  )
}
