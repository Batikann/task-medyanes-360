import { getDataByManyRelitionalTable } from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // İstekten id'yi alır.
    const { id } = req.query

    try {
      const taskId = id // id'yi taskId olarak atar.
      const where = { taskId: taskId } // Sorguda kullanılacak where koşulunu oluşturur.
      const include = {
        user: {
          select: {
            email: true,
            name: true,
            id: true,
          },
        }, // Yorumlarla ilişkilendirilmiş kullanıcı bilgilerini de (email, username, id) getirir.
      }

      const orderBy = {
        createdAt: 'desc', // Yorumları createdAt alanına göre azalan sırada (yeniden eskiye) sıralar.
      }

      // getDataByManyRelitionalTable fonksiyonunu kullanarak Comment tablosundan verileri çeker.
      const comments = await getDataByManyRelitionalTable(
        'Comment',
        where,
        include,
        orderBy
      )

      // veritabanından yorumları getirirken herhangi bir hata alırsak bunu döndür.
      if (comments.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanın da bir hata oluştu!',
          error: comments.error,
        })
      }

      // Başarılı olursa 200 durum kodu ve yorumları döner.
      return res.status(200).json({ status: 'success', comments })
    } catch (error) {
      // Hata olursa 500 durum kodu ve hata mesajını döner.
      return res.status(500).json({ status: 'error', message: error.message })
    }
  }
  // Eğer istek 'GET' değilse 405 durum kodu ve 'Method not allowed' mesajını döner.
  return res
    .status(405)
    .json({ status: 'error', message: 'Method not allowed' })
}

export default handler
