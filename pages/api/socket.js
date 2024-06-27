import { Server } from 'socket.io'

let io

const handler = (req, res) => {
  if (!io) {
    io = new Server(res.socket.server, {
      path: '/api/socket',
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('A user connected')

      socket.on('join', (userId) => {
        socket.join(userId)
        console.log(`User ${userId} joined room`)
      })

      socket.on('leave', (userId) => {
        socket.leave(userId)
        console.log(`User ${userId} left room`)
      })

      socket.on('disconnect', () => {
        console.log('A user disconnected')
      })
    })
  }
  res.end()
}

export default handler
