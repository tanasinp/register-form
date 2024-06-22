import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  return (
    <>
      <Navbar/>
      <div>
        <Dashboard/>
      </div>
    </>
  )
}

export default App
