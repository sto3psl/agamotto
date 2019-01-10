import React, { Component } from 'react'

const DateFormat = new Intl.DateTimeFormat(navigator.language, {
  weekday: 'long',
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
      items: []
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
        const index = this.state.items.findIndex(item => item._id === change.id)
        console.log(change, index)
        this.setState(prevState => {
          if (change.deleted) {
            prevState.items.splice(index, 1)
            return prevState
          }

          if (index >= 0) {
            prevState.items[index] = change.doc
          } else {
            const items = [change.doc].concat(prevState.items)
            console.log(items)
            prevState.items = items
          }
          return prevState
        })
      })

    const { rows } = await store.allDocs({ include_docs: true, descending: true })
    this.setState(() => ({
      items: rows.map(row => row.doc)
    }))
    console.log(rows.map(row => row.doc))
  }

  addEntry() {
    const now = new Date()
    this.props.store.put({
      _id: `id-${+now}`,
      startDate: now,
      stopDate: null
    })
  }

  modifyEntry(id) {
    return async () => {
      const { store } = this.props
      const doc = await store.get(id)

      this.props.store.put({
        ...doc,
        _deleted: true
      })
    }
  }

  render() {
    const { store, children } = this.props
    return (
      <div>
        <button onClick={this.addEntry}>New Entry</button>
        <ul>
          {this.state.items.map((item, i) => {
            const startDate = new Date(item.startDate)
            return (
              <li key={`${i}-${item._id}`}>
                  <div>{TimeFormat.format(startDate)} Uhr</div>
                  <div>{DateFormat.format(startDate)}</div>
                  <button onClick={this.modifyEntry(item._id)}>Löschen</button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
