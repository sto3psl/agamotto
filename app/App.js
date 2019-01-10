import React, { Component } from 'react'

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      items: []
    }

    this.addEntry = this.addEntry.bind(this)
  }

  async loadDocs() {
    const items = await this.props.store.allDocs({
      include_docs: true,
      descending: true
    })

    this.setState(() => ({
      items: items.rows
    }))
    console.log(items)
  }

  async componentDidMount() {
    this.loadDocs()
  }

  async addEntry() {
    const time = new Date()
    const res = await this.props.store.put({
      _id: time,
      name: `Entry ${time.toISOString()}`,
      date: time
    })
    this.loadDocs()
    console.log(res)
  }

  render({ store, children }) {
    return (
      <div>
        <button onClick={this.addEntry}>Add entry</button>
        <ul>
          {this.state.items.map(item => (
            <li>
              {new Date(item.doc.date).toLocaleDateString()}-
              {new Date(item.doc.date).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
