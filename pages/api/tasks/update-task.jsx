import {
  deleteDataByMany,
  updateDataByAny,
} from '../../../services/servicesOperations'

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

    // Başarılı olursa 200 durum kodu ve güncellenmiş veriyi döner.
    return res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    // Hata olursa 500 durum kodu ve hata mesajını döner.
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

export default handler
