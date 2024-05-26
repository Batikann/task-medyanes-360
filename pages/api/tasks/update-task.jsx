import {
  deleteDataByMany,
  updateDataByAny,
} from '../../../services/servicesOperations'

async function handler(req, res) {
  if (!req || !req.body) {
    return res.status(400).json({ status: 'error', message: 'Invalid request' })
  }

  const {
    id,
    title,
    description,
    priority,
    createdAt,
    status,
    assignedUsers,
    subtasks,
  } = req.body

  try {
    // Mevcut alt görevleri ve atanan kullanıcıları temizle
    await Promise.all([
      deleteDataByMany('Subtask', { taskId: id }),
      deleteDataByMany('UserOnTask', { taskId: id }),
    ])

    // Geri kalan verileri güncelle
    const newData = {
      title,
      description,
      priority,
      createdAt: new Date(createdAt),
      status,
      subtasks: {
        create: subtasks.map((subtask) => ({
          id: subtask.id,
          title: subtask.title,
          createdAt: new Date(subtask.createdAt),
          status: subtask.status,
        })),
      },
      assignedUsers: {
        create: assignedUsers.map((userId) => ({
          userId: userId,
        })),
      },
      comments: { create: [] },
    }

    const result = await updateDataByAny('Task', { id }, newData)
    return res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

export default handler
