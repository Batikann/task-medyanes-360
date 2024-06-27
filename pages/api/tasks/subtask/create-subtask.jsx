import {
  createNewData,
  createNotifications,
} from '../../../../services/servicesOperations/index'
import prisma from '../../../../lib/prisma'

const handler = async (req, res) => {
  if (!req) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Bir hata oluştu!' })
  }

  if (req.method === 'POST' && req.body) {
    const { title, createdAt, taskId, userId } = req.body

    const subtask = {
      title,
      createdAt: new Date(createdAt),
      taskId,
      userId,
    }

    try {
      // createNewData fonksiyonunu kullanarak Task tablosuna yeni subtask ekler.
      const result = await createNewData('Subtask', subtask)

      // veritabanına ekleme işlemi yaparken herhangi bir hata alırsak bunu döndür.
      if (result.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanına kaydedilirken bir hata oluştu!',
          error: result.error,
        })
      }

      // TaskId ile ilişkili görevi bulun ve atanan kullanıcıları alın
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { assignedUsers: true },
      })

      if (!task) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Task not found' })
      }

      const notifications = task.assignedUsers.map((user) => ({
        userId: user.userId,
        taskId,
        message: `${task.title} Porjesinde Yeni bir görev "${title}" eklendi.`,
        createdAt: new Date(),
        type: 'CREATE',
      }))

      // Bildirimleri kaydedin
      const notificationResult = await createNotifications(notifications)

      if (notificationResult.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Bildirimler oluşturulurken bir hata oluştu!',
          error: notificationResult.error,
        })
      }

      // Bildirimleri gerçek zamanlı olarak gönderin (Socket.IO kullanarak)
      const io = req.socket.server.io
      task.assignedUsers.forEach((user) => {
        io.to(user.userId).emit('new_notification', {
          message: `${task.title} Porjesinde Yeni bir görev "${title}" eklendi.`,
        })
      })

      return res.status(200).json({ status: 'success', data: result })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message })
    }
  } else {
    return res
      .status(405)
      .json({ status: 'error', message: 'Method Not Allowed' })
  }
}

export default handler
