import {
  deleteDataByAny,
  createNotifications,
} from '../../../../services/servicesOperations/index.js'
import prisma from '../../../../lib/prisma'

const handler = async (req, res) => {
  if (!req) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Bir hata oluştu!' })
  }

  if (req.method === 'POST' && req.body) {
    try {
      const { id } = req.body

      // id'nin tanımlı olup olmadığını kontrol edelim
      if (!id) {
        return res
          .status(400)
          .json({ status: 'error', message: 'ID alanı gerekli!' })
      }

      // Silinmeden önce subtask'i bulun
      const subtask = await prisma.subtask.findUnique({
        where: { id },
      })

      if (!subtask) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Subtask bulunamadı!' })
      }

      // Belirtilen id'ye göre veriyi sil
      const deleteRes = await deleteDataByAny('Subtask', { id })

      // Silme işlemi yaparken herhangi bir hata alırsak bunu döndür.
      if (deleteRes.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanında bir hata oluştu!',
          error: deleteRes.error,
        })
      }

      // Hata kontrolü
      if (deleteRes.error) {
        return res.status(404).json({ status: 'error', res: deleteRes.error })
      }

      // TaskId ile ilişkili görevi bulun ve atanan kullanıcıları alın
      const task = await prisma.task.findUnique({
        where: { id: subtask.taskId },
        include: { assignedUsers: true },
      })

      if (!task) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Task not found' })
      }

      const notifications = task.assignedUsers.map((user) => ({
        userId: user.userId,
        taskId: subtask.taskId,
        message: `${task.title} Projesinden Bir görev "${subtask.title}" silindi.`,
        createdAt: new Date(),
        type: 'DELETE',
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
          message: `${task.title} Projesinden Bir görev "${subtask.title}" silindi.`,
        })
      })

      // Başarıyla silindiğinde başarı mesajı dön
      return res.status(200).json({ status: 'success', res: deleteRes })
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
