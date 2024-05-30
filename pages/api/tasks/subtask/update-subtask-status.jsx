import { updateDataByAny } from '../../../../services/servicesOperations/index.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ status: 'error', message: 'Method not allowed' })
  }

  // bodyden subtaskId ve status değerlerini alıyoruz.

  const { subtaskId, status } = req.body

  // Eğer subtaskId eksikse, 400 Bad Request hatası döner.
  if (!subtaskId) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Subtask ID is required' })
  }

  try {
    // updateDataByAny fonksiyonunu kullanarak Subtask tablosunda id ile eşleşen kaydı günceller.
    const result = await updateDataByAny(
      'Subtask',
      { id: subtaskId },
      { status }
    )

    // güncelleşme işlemi yaparken herhangi bir hata alırsak bunu döndür.
    if (result.error) {
      return res.status(500).json({
        status: 'error',
        message: 'Veritabanında bir hata oluştu!',
        error: result.error,
      })
    }
    // Başarılı olursa 200 durum kodu ve başarı mesajı döner.
    return res.status(200).json({ status: 'success' })
  } catch (error) {
    // Hata olursa 500 durum kodu ve hata mesajını döner.
    return res.status(500).json({ status: 'error', message: error.message })
  }
}
