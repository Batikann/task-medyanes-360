import {
  getDataByMany,
  getDataByManyRelitionalTable,
} from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { id, status } = req.query

    if (!id) {
      return res
        .status(400)
        .json({ status: 'error', message: 'id parametresi gereklidir.' })
    }

    const include = {
      subtasks: true,
      comments: true,
      assignedUsers: {
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
      // İlk olarak kullanıcının görevlerini al
      const userTasks = await getDataByMany('UserOnTask', {
        userId: id,
      })

      const taskIds = userTasks.map((userTask) => userTask.taskId)

      // taskFilter objesini başlat
      let taskFilter = { id: { in: taskIds } }

      // Görevleri al
      const tasks = await getDataByManyRelitionalTable(
        'Task',
        taskFilter,
        include
      )

      if (tasks.error) {
        return res.status(500).json({
          status: 'error',
          message: 'Veritabanında bir hata oluştu!',
          error: tasks.error,
        })
      }

      // Görevleri önceliklerine göre grupla
      const lowPriorityTasks = tasks.filter((task) => task.priority === 'LOW')
      const mediumPriorityTasks = tasks.filter(
        (task) => task.priority === 'MEDIUM'
      )
      const highPriorityTasks = tasks.filter((task) => task.priority === 'HIGH')

      return res.status(200).json({
        status: 'success',
        tasks: {
          lowPriorityTasks: lowPriorityTasks,
          mediumPriorityTasks: mediumPriorityTasks,
          highPriorityTasks: highPriorityTasks,
        },
      })
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
