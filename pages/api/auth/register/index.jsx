import {
  createNewData,
  getDataByUnique,
} from '../../../../services/servicesOperations'
import bcrypt from 'bcrypt'

const handler = async (req, res) => {
  if (!req) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Bir hata oluştu!' })
  }

  if (req.method === 'POST' && req.body) {
    const { email, password, username } = req.body

    try {
      //Kullanıcının register olurken kullandıpı email adresi daha önce sisteme kayıtlı ise bir hata mesajı döndür.
      const existingUser = await getDataByUnique('User', { email: email })
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Bu email adresi zaten kayıtlı!',
        })
      }
      // Parolayı hashle
      const hashedPassword = await bcrypt.hash(password, 10)

      // Yeni kullanıcı verilerini oluştur
      const newData = {
        email,
        password: hashedPassword,
        name: username,
      }
      // Veriyi veritabanına kaydet
      const savedData = await createNewData('User', newData)

      //Kayıt edilirken herhangi bir hata olduysa hata mesajı döndür
      if (savedData.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanına kaydedilirken bir hata oluştu!',
          error: savedData.error,
        })
      }

      return res
        .status(200)
        .json({ status: 'success', message: 'Kayıt başarılı', data: savedData })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Bir hata oluştu!',
        error: error.message,
      })
    }
  } else {
    return res
      .status(405)
      .json({ status: 'error', message: 'Method not allowed' })
  }
}

export default handler
