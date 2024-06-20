import { createNewData } from '../../../../services/servicesOperations/index'

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
