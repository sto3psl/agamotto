import React, { Component, Fragment } from 'react'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import distanceInWords from 'date-fns/distance_in_words'
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import { formatTimeDifference } from './utils/time'

import RunningTimer from './RunningTimer'
import styles from './layout.css'
import StartButton from './StartButton'
import ListItem from './ListItem'

const DateFormat = new Intl.DateTimeFormat(navigator.language, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const TimeFormat = new Intl.DateTimeFormat(navigator.language, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
})

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      timerList: []
    }

    this.addEntry = this.addEntry.bind(this)
  }

  async componentDidMount() {
    const { store } = this.props

    store
      .changes({
        since: 'now',
        live: true,
        include_docs: true
      })
      .on('change', change => {
        const index = this.state.timerList.findIndex(item => item._id === change.id)

        this.setState(prevState => {
          if (change.deleted) {
            prevState.timerList.splice(index, 1)
            return prevState
          }

          if (index >= 0) {
            prevState.timerList[index] = change.doc
          } else {
            const timerList = [change.doc].concat(prevState.timerList)
            prevState.timerList = timerList
          }
          return prevState
        })
      })

    const { rows } = await store.allDocs({ include_docs: true, descending: true })
    this.setState(() => ({
      timerList: rows.map(row => row.doc)
    }))
  }

  addEntry() {
    const now = new Date()
    this.props.store.put({
      _id: `id-${+now}`,
      startDate: now,
      stopDate: null
    })
  }

  deleteEntry(id) {
    return async () => {
      const { store } = this.props
      const doc = await store.get(id)

      this.props.store.put({
        ...doc,
        _deleted: true
      })
    }
  }

  modifyEntry(id) {
    return async () => {
      const { store } = this.props
      const doc = await store.get(id)

      this.props.store.put({
        ...doc,
        stopDate: new Date()
      })
    }
  }

  render() {
    const { store, children } = this.props
    let { timerList } = this.state

    const timerIsRunning = !!timerList.length && !timerList[0].stopDate
    let runningTimer = timerIsRunning ? timerList[0] : null

    const list = timerIsRunning ? timerList.slice(1) : timerList

    return (
      <div className={styles.grid}>
        <div className={styles.main}>
          {runningTimer ? (
            <RunningTimer
              TimeFormat={TimeFormat}
              startDate={runningTimer.startDate}
              onCancel={this.deleteEntry(runningTimer._id)}
              onStop={this.modifyEntry(runningTimer._id)}
            />
          ) : (
            <StartButton onClick={this.addEntry}>New Entry</StartButton>
          )}
        </div>
        <div className={styles.list}>
          {list.map((item, i) => (
            <ListItem
              key={`${i}-${item._id}`}
              {...item}
              DateFormat={DateFormat}
              TimeFormat={TimeFormat}
              onDelete={this.deleteEntry(item._id)}
            />
          ))}
        </div>
      </div>
    )
  }
}
