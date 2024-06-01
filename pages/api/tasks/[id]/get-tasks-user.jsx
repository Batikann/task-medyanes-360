import { getDataByMany } from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { id, status } = req.query

    try {
      if (id) {
        // İlk olarak kullanıcının görevlerini al
        const userTasks = await getDataByMany('UserOnTask', {
          userId: id,
        })

        const taskIds = userTasks.map((userTask) => userTask.taskId)

        // taskFilter objesini başlat
        let taskFilter = { id: { in: taskIds } }

        // Status kontrolü
        if (status && status !== 'ALL') {
          taskFilter.status = status
        }

        // Görevleri al
        const tasks = await getDataByMany('Task', taskFilter)

        if (tasks.error) {
          return res.status(500).json({
            status: 'error',
            message: 'Veritabanında bir hata oluştu!',
            error: tasks.error,
          })
        }

        return res.status(200).json({ status: 'success', tasks })
      } else {
        return res
          .status(400)
          .json({ status: 'error', message: 'id parametresi gereklidir.' })
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    return res
      .status(405)
      .json({ status: 'error', message: `Method ${req.method} Not Allowed` })
  }
}

export default handler
