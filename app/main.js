import React from 'react'
import { render } from 'react-dom'
import App from './App'
import PouchDB from 'pouchdb'

const root = document.getElementById('app')
const db = new PouchDB('times')


async function boot() {
  const info = await db.info()
  render(<App store={db}>{info.db_name}</App>, root)
}

boot()
