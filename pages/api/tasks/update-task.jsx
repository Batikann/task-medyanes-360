import prisma from '../../../lib/prisma'
import {
  createNotifications,
  deleteDataByMany,
  updateDataByAny,
} from '../../../services/servicesOperations'
import {
  checkNotificationExists,
  deleteNotifications,
} from '../../../services/servicesOperations/index'

async function handler(req, res) {
  if (!req || !req.body) {
    return res.status(400).json({ status: 'error', message: 'Invalid request' })
  }

  const {
    id,
    title,
    description,
    priority,
    createdAt,
    status,
    assignedUsers,
    subtasks,
  } = req.body

  try {
    // Önceki atanan kullanıcıları alın
    const previousTask = await prisma.task.findUnique({
      where: { id },
      include: { assignedUsers: true, subtasks: true },
    })

    const previousUserIds = previousTask.assignedUsers.map(
      (user) => user.userId
    )
    const newUserIds = assignedUsers.filter(
      (userId) => !previousUserIds.includes(userId)
    )
    const removedUserIds = previousUserIds.filter(
      (userId) => !assignedUsers.includes(userId)
    )

    // Silinen subtasks'leri belirle
    const previousSubtaskIds = previousTask.subtasks.map(
      (subtask) => subtask.id
    )
    const newSubtaskIds = subtasks.map((subtask) => subtask.id)
    const addedSubtasks = subtasks.filter(
      (subtask) => !previousSubtaskIds.includes(subtask.id)
    )
    const removedSubtasks = previousTask.subtasks.filter(
      (subtask) => !newSubtaskIds.includes(subtask.id)
    )

    // taskId ile ilişkili subtask ve atanan kullanıcıları siler.
    await Promise.all([
      deleteDataByMany('Subtask', { taskId: id }), // Task ile ilişkili subtasks'leri siler.
      deleteDataByMany('UserOnTask', { taskId: id }), // Task ile ilişkili kullanıcıları siler.
    ])

    // Güncellenecek yeni veri nesnesini hazırlar.
    const newData = {
      title,
      description,
      priority,
      createdAt: new Date(createdAt), // createdAt alanını Date nesnesine çevirir.
      status,
      subtasks: {
        create: subtasks.map((subtask) => ({
          id: subtask.id,
          title: subtask.title,
          createdAt: new Date(subtask.createdAt), // subtask için createdAt alanını Date nesnesine çevirir.
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

    // updateDataByAny fonksiyonunu kullanarak Task tablosunda id ile eşleşen kaydı günceller.
    const result = await updateDataByAny('Task', { id }, newData)

    // Bildirimleri hazırlayın
    const notifications = []
    const io = req.socket.server.io

    // Yeni kullanıcılar için bildirimler
    await Promise.all(
      newUserIds.map(async (userId) => {
        const notificationExists = await checkNotificationExists(
          userId,
          id,
          'CREATE'
        )

        if (!notificationExists) {
          notifications.push({
            userId,
            taskId: result.id,
            message: `Admin sizi ${title} projesinde görevlendirdi`,
            createdAt: new Date(),
            type: 'CREATE',
          })
          io.to(userId).emit('new_notification', {
            message: `Admin sizi ${title} projesinde görevlendirdi`,
          })
        }
      })
    )

    // Eklenen veya silinen subtasks varsa bildirim gönder
    if (addedSubtasks.length > 0 || removedSubtasks.length > 0) {
      const projectUserIds = assignedUsers
        .concat(previousUserIds)
        .filter((v, i, a) => a.indexOf(v) === i) // Tekrarlı id'leri kaldır

      projectUserIds.forEach((userId) => {
        if (addedSubtasks.length > 0) {
          const message = `${
            result.title
          } Adlı Projeye yeni görevler eklendi: ${addedSubtasks
            .map((subtask) => subtask.title)
            .join(', ')}`
          notifications.push({
            userId,
            taskId: result.id,
            message,
            createdAt: new Date(),
            type: 'UPDATE',
          })
          io.to(userId).emit('new_notification', { message })
        }

        if (removedSubtasks.length > 0) {
          const message = `${
            result.title
          } Projeden görevler silindi: ${removedSubtasks
            .map((subtask) => subtask.title)
            .join(', ')}`
          notifications.push({
            userId,
            taskId: result.id,
            message,
            createdAt: new Date(),
            type: 'DELETE',
          })
          io.to(userId).emit('new_notification', { message })
        }
      })
    }

    // Bildirimleri kaydedin
    const notificationResult = await createNotifications(notifications)

    if (notificationResult.status === 'error') {
      return res.status(500).json({
        status: 'error',
        message: 'Bildirimler oluşturulurken bir hata oluştu!',
        error: notificationResult.message,
      })
    }

    if (removedUserIds.length > 0) {
      // Çıkarılan kullanıcılar için bildirimler ve bildirim silme
      await Promise.all(
        removedUserIds.map(async (userId) => {
          const message = `${title} projesindeki görevinize son verilmiştir.`
          await deleteNotifications(userId, id)
          io.to(userId).emit('new_notification', {
            message,
          })
        })
      )

      const removedUserNotifications = removedUserIds.map((userId) => ({
        userId,
        taskId: result.id,
        message: `${title} projesindeki görevinize son verilmiştir.`,
        createdAt: new Date(),
        type: 'DELETE',
      }))

      const removedUserNotificationResult = await createNotifications(
        removedUserNotifications
      )

      if (removedUserNotificationResult.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Bildirimler oluşturulurken bir hata oluştu! Silme',
          error: notificationResult.error,
        })
      }
    }

    // Başarılı olursa 200 durum kodu ve güncellenmiş veriyi döner.
    return res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    // Hata olursa 500 durum kodu ve hata mesajını döner.
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

export default handler
