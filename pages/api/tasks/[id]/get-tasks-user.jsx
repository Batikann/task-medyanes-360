import { getDataByMany } from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // İstekten gelen 'id' sorgu parametresini al
    const { id } = req.query
    try {
      if (id) {
        // 'UserOnTask' tablosundan 'userId' ile eşleşen verileri al
        const userTasks = await getDataByMany('UserOnTask', {
          userId: id,
        })

        // Task id'lerini çıkar
        const taskIds = userTasks.map((userTask) => userTask.taskId)

        // 'Task' tablosundan bu Task id'lerine ait görevleri al
        const tasks = await getDataByMany('Task', { id: { in: taskIds } })

        // İşlem başarılı ise taskları response ile gönder.
        return res.status(200).json({ status: 'success', tasks })
      }
    } catch (error) {
      // Hata durumunda hata mesajı ile yanıt gönder
      return res.status(500).json({ status: 'error', message: error.message })
    }
  }
}

export default handler
