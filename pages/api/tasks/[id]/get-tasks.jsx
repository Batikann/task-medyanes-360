import { getDataByManyRelitionalTable } from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query
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
              username: true,
            },
          },
        },
      },
    }
    try {
      switch (id) {
        case 'COMPLETED_CHECK_PENDING':
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
            },
          })

        case 'UPDATE_PENDING':
          const updatePendingTask = await getDataByManyRelitionalTable(
            'Task',
            {
              status: 'UPDATE_PENDING',
            },
            include
          )
          return res.status(200).json({
            status: 'success',
            data: {
              tasks: updatePendingTask,
            },
          })

        case 'INFO_REQUEST_PENDING':
          const infoRequestPendingTask = await getDataByManyRelitionalTable(
            'Task',
            {
              status: 'INFO_REQUEST_PENDING',
            },
            include
          )
          return res.status(200).json({
            status: 'success',
            data: {
              tasks: infoRequestPendingTask,
            },
          })

        case 'CUSTOMER_WAITING':
          const customerWaitingTask = await getDataByManyRelitionalTable(
            'Task',
            {
              status: 'CUSTOMER_WAITING',
            },
            include
          )
          return res.status(200).json({
            status: 'success',
            data: {
              tasks: customerWaitingTask,
            },
          })

        case 'ALL':
          const tasks = await getDataByManyRelitionalTable('Task', {}, include)

          return res.status(200).json({
            status: 'success',
            data: {
              tasks: tasks,
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
