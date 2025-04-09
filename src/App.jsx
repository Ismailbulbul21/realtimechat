import React from 'react'
import { AuthProvider } from './AuthContext'
import Chat from './components/Chat'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AuthProvider>
        <Chat />
      </AuthProvider>
    </div>
  )
}

export default App