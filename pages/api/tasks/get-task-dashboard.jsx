import { getDataByMany } from '../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const tasks = await getDataByMany('Task')
      const completedCheckPendingCount = tasks.filter(
        (task) => task.status === 'COMPLETED_CHECK_PENDING'
      ).length
      const inProgressCount = tasks.filter(
        (task) => task.status === 'IN_PROGRESS'
      ).length

      return res.status(200).json({
        status: 'success',
        completedTaskCount: completedCheckPendingCount,
        inProgressTaskCount: inProgressCount,
        allTaskCount: tasks.length,
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Veritabanında bir hata oluştu!',
        error: error.message,
      })
    }
  }
  return res
    .status(405)
    .json({ status: 'error', message: 'Method not allowed' })
}

export default handler
