import { updateDataByAny } from '../../../../services/servicesOperations'

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
    const { content, status } = req.body

    // Güncellenecek veri objesini oluşturur.
    const data = {
      content,
      status,
    }

    try {
      // updateDataByAny fonksiyonunu kullanarak Comment tablosunda id ile eşleşen kaydı günceller.
      const result = await updateDataByAny(
        'Comment',
        { id: req.query.id }, // Güncelleme için where koşulu
        data // Güncellenecek veri
      )
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
