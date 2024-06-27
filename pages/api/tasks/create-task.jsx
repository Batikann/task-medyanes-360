import {
  createNewData,
  createNotifications,
} from '../../../services/servicesOperations/index.js'

const handler = async (req, res) => {
  if (req.method !== 'POST' || !req.body) {
    return res
      .status(405)
      .json({ status: 'error', message: 'Method Not Allowed' })
  }

  const {
    title,
    description,
    priority,
    createdAt,
    status,
    assignedUsers,
    subtasks,
  } = req.body

  const newData = {
    title,
    description,
    priority,
    createdAt: new Date(createdAt),
    status,
    subtasks: {
      create: subtasks.map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
        createdAt: new Date(subtask.createdAt),
        status: subtask.status,
        userId: subtask.userId,
      })),
    },
    assignedUsers: {
      create: assignedUsers.map((userId) => ({
        userId: userId,
      })),
    },
    comments: { create: [] },
  }

  try {
    const result = await createNewData('Task', newData)

    if (result.error) {
      return res.status(500).json({
        status: 'error',
        message: 'Veritabanına kaydedilirken bir hata oluştu!',
        error: result.error,
      })
    }

    const notifications = assignedUsers.map((userId) => ({
      userId,
      taskId: result.id,
      message: `Admin sizi ${title} projesinde görevlendirdi`,
      createdAt: new Date(),
    }))

    const notificationResult = await createNotifications(notifications)

    if (notificationResult.error) {
      return res.status(500).json({
        status: 'error',
        message: 'Bildirimler oluşturulurken bir hata oluştu!',
        error: notificationResult.error,
      })
    }

    const io = req.socket.server.io
    assignedUsers.forEach((userId) => {
      io.to(userId).emit('new_notification', {
        message: `Admin sizi ${title} projesinde görevlendirdi`,
      })
    })

    return res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

export default handler
