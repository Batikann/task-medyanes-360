'use client'

import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded shadow">
          {notification}
        </div>
      )}
    </NotificationContext.Provider>
  )
}
