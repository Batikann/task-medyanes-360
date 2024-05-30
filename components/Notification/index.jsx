'use client'

import { useEffect, useState } from 'react'

const Notification = ({ message, localStorageKey }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const hasSeenNotification = localStorage.getItem(localStorageKey)
    if (!hasSeenNotification) {
      setVisible(true)
      localStorage.setItem(localStorageKey, 'true')
      const timer = setTimeout(() => {
        setVisible(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [localStorageKey])

  if (!visible) return null

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded shadow">
      {message}
    </div>
  )
}
export default Notification
