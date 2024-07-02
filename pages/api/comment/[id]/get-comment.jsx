import { getDataByManyRelitionalTable } from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // İstekten commentId'yi alır.
    const { id: commentId } = req.query

    try {
      const where = { id: commentId } // Sorguda kullanılacak where koşulunu oluşturur.
      const include = {
        user: {
          select: {
            email: true,
            name: true,
            id: true,
          },
        }, // Yorumlarla ilişkilendirilmiş kullanıcı bilgilerini de (email, username, id) getirir.
      }

      // getDataByManyRelitionalTable fonksiyonunu kullanarak Comment tablosundan veriyi çeker.
      const comment = await getDataByManyRelitionalTable(
        'Comment',
        where,
        include
      )

      // Veritabanından yorumu getirirken herhangi bir hata alırsak bunu döndür.
      if (comment.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanında bir hata oluştu!',
          error: comment.error,
        })
      }

      // Başarılı olursa 200 durum kodu ve yorumu döner.
      return res.status(200).json({ status: 'success', comment })
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
