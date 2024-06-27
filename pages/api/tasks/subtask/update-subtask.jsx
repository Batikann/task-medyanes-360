import {
  createNotifications,
  updateDataByAny,
} from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  // Eğer istek mevcut değilse hata döner.
  if (!req) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Bir hata oluştu!' })
  }

  // Eğer istek 'POST' türünde ve istek gövdesi varsa bu bloğa girer.
  if (req.method === 'POST' && req.body) {
    // bodyden content ve status değerlerini alır.
    const { title, createdAt, id } = req.body

    // Güncellenecek veri objesini oluşturur.
    const data = {
      title,
      createdAt: new Date(createdAt),
    }

    try {
      // updateDataByAny fonksiyonunu kullanarak Comment tablosunda id ile eşleşen kaydı günceller.
      const result = await updateDataByAny(
        'Subtask',
        { id: id }, // Güncelleme için where koşulu
        data // Güncellenecek veri
      )

      // güncelleme işlemi yaparken herhangi bir hata alırsak bunu döndür.
      if (result.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanın da bir hata oluştu!',
          error: result.error,
        })
      }

      const subtask = await prisma.subtask.findUnique({
        where: { id: id },
        include: { task: { include: { assignedUsers: true } } },
      })

      if (!subtask || !subtask.task) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Task not found' })
      }

      const task = subtask.task
      const notifications = task.assignedUsers.map((user) => ({
        userId: user.userId,
        taskId: task.id,
        message: `${task.title} projesinde bir görev güncellendi.`,
        createdAt: new Date(),
        type: 'UPDATE',
      }))

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
          message: `${task.title} projesinde bir görev güncellendi.`,
        })
      })
      // Başarılı olursa 200 durum kodu ve güncellenmiş veriyi döner.
      return res.status(200).json({ status: 'success', data: result })
    } catch (error) {
      // Hata olursa 500 durum kodu ve hata mesajını döner.
      return res.status(500).json({ status: 'error', message: error.message })
    }
  } else {
    // Eğer istek 'POST' değilse veya istek gövdesi yoksa 405 durum kodu ve 'Method Not Allowed' mesajını döner.
    return res
      .status(405)
      .json({ status: 'error', message: 'Method Not Allowed' })
  }
}

export default handler
