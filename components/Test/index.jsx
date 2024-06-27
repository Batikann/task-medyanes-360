import { useEffect, useState } from 'react'
import socket from '../../lib/utils/socket'

const Notification = ({ userId }) => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (userId) {
      socket.emit('join', userId)

      socket.on('new_notification', (notification) => {
        setNotifications((prev) => [...prev, notification])
      })
    }

    return () => {
      if (userId) {
        socket.emit('leave', userId)
      }
    }
  }, [userId])

  return (
    <div>
      {notifications.map((notification, index) => (
        <div key={index}>{notification.message}</div>
      ))}
    </div>
  )
}

export default Notification
