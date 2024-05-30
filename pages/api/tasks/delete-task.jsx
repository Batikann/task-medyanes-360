import { deleteDataByAny } from '../../../services/servicesOperations/index.js'

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
          .json({ status: 'error', message: 'ID is required' })
      }

      // Belirtilen id'ye göre veriyi sil
      const deleteRes = await deleteDataByAny('Task', { id })

      // silme işlemi yaparken herhangi bir hata alırsak bunu döndür.
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
