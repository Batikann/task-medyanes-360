import { createNewData } from '../../../services/servicesOperations/index.js'

const handler = async (req, res) => {
  if (!req) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Bir hata oluştu!' })
  }

  if (req.method === 'POST' && req.body) {
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
          userId: userId, // assignedUsers alanını oluşturur.
        })),
      },
      comments: { create: [] }, // comments alanını boş olarak oluşturur.
    }

    try {
      // createNewData fonksiyonunu kullanarak Task tablosuna yeni veri ekler.
      const result = await createNewData('Task', newData)

      // veritabanına ekleme işlemi yaparken herhangi bir hata alırsak bunu döndür.
      if (result.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanına kaydedilirken bir hata oluştu!',
          error: result.error,
        })
      }
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
