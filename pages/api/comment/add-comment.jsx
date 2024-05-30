import { createNewData } from '../../../services/servicesOperations'

const handler = async (req, res) => {
  if (!req) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Bir hata oluştu!' })
  }

  if (req.method === 'POST' && req.body) {
    const { content, status, taskId, userId } = req.body

    // Oluşturulacak comment objesi hazırlarnır.
    const data = {
      content,
      status,
      taskId,
      userId,
    }

    try {
      // createNewData fonksiyonunu kullanarak Comment tablosuna yeni veri ekler.
      const result = await createNewData('Comment', data)

      // veritabanına kayıt ederken herhangi bir hata alırsak bunu döndür.
      if (result.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanına kaydedilirken bir hata oluştu!',
          error: result.error,
        })
      }

      // Başarılı olursa 200 durum kodu ve oluşturulan veriyi döner.
      return res.status(200).json({ status: 'success', data: result })
    } catch (error) {
      // Hata olursa 500 durum kodu ve hata mesajını döner.
      return res.status(500).json({ status: 'error', message: error.message })
    }
  } else {
    return res
      .status(405)
      .json({ status: 'error', message: 'Method Not Allowed' })
  }
}

export default handler
