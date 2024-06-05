import {
  getDataByMany,
  getDataByManyRelitionalTable,
} from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query
    const include = {
      // Task ile ilişkilendirilmiş comments verisini getirir.
      assignedUsers: {
        // assignedUsers ile ilişkilendirilmiş user verisini getirir.
        include: {
          user: {
            select: {
              email: true,
              username: true,
            },
          },
        },
      },
    }
    try {
      switch (id) {
        case 'COMPLETED_TASK':
          const completedTask = await getDataByManyRelitionalTable(
            'Task',
            {
              status: 'COMPLETED_CHECK_PENDING',
            },
            include
          )
          return res.status(200).json({
            status: 'success',
            data: {
              tasks: completedTask,
              completedTaskCount: completedTask.length,
            },
          })

        case 'IN_PROGRESS':
          const inProgressTask = await getDataByManyRelitionalTable(
            'Task',
            {
              status: 'IN_PROGRESS',
            },
            include
          )
          return res.status(200).json({
            status: 'success',
            data: {
              tasks: inProgressTask,
              inProgressTaskCount: inProgressTask.length,
            },
          })

        case 'ALL':
          const tasks = await getDataByManyRelitionalTable('Task', {}, include)
          const completedCheckPendingCount = tasks.filter(
            (task) => task.status === 'COMPLETED_CHECK_PENDING'
          ).length
          const inProgressCount = tasks.filter(
            (task) => task.status === 'IN_PROGRESS'
          ).length
          return res.status(200).json({
            status: 'success',
            data: {
              tasks: tasks,
              completedTaskCount: completedCheckPendingCount,
              inProgressTaskCount: inProgressCount,
              allTaskCount: tasks.length,
            },
          })

        default:
          return res.status(400).json({
            status: 'error',
            message: 'Geçersiz Arama Parametresi',
          })
      }
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
