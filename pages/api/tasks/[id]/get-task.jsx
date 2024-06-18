import { getDataByUniqueRelitionalTable } from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query

    try {
      const taskId = id
      const include = {
        subtasks: {
          include: {
            user: true,
          },
        }, // Task ile ilişkilendirilmiş subtasks verisini getirir.
        comments: true, // Task ile ilişkilendirilmiş comments verisini getirir.
        assignedUsers: {
          // assignedUsers ile ilişkilendirilmiş user verisini getirir.
          include: {
            user: true,
          },
        },
      }

      const orderBy = {
        createdAt: 'desc', // Yorumları createdAt alanına göre azalan sırada (yeniden eskiye) sıralar.
      }

      // getDataByUniqueRelitionalTable fonksiyonunu kullanarak Task tablosundan veriyi alır.
      const task = await getDataByUniqueRelitionalTable(
        'Task',
        { id: taskId }, // Task verisini çekmek için where koşulu.
        include // İlişkili tabloları da dahil eder.
      )

      // veritabanından getirme işlemi yaparken herhangi bir hata alırsak bunu döndür.
      if (task.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanında bir hata oluştu!',
          error: task.error,
        })
      }

      // Başarılı olursa 200 durum kodu ve task verisini döner.
      return res.status(200).json({ status: 'success', task })
    } catch (error) {
      // Hata olursa 500 durum kodu ve hata mesajını döner.
      return res.status(500).json({ status: 'error', message: error.message })
    }
  }

  return res
    .status(500)
    .json({ status: 'error', message: 'Method not allowed' })
}

export default handler
