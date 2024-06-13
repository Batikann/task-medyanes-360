import { getDataByManyRelitionalTable } from '../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const include = {
      subtasks: true,
      comments: true,
      // Task ile ilişkilendirilmiş comments verisini getirir.
      assignedUsers: {
        // assignedUsers ile ilişkilendirilmiş user verisini getirir.
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
    }
    try {
      const tasks = await getDataByManyRelitionalTable('Task', {}, include)

      return res.status(200).json({
        status: 'success',
        data: {
          tasks: tasks,
        },
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
