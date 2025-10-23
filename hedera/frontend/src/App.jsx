import { useState } from 'react'
import NegotiationDemo from './components/NegotiationDemo'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <NegotiationDemo />
      </main>
    </div>
  )
}

export default App
