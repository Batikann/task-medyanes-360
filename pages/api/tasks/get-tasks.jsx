import { getAllData } from '../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const tasks = await getAllData('Task')

    // 'COMPLETED_CHECK_PENDING' (Tamamlanan)  durumundaki görevlerin sayısını hesaplar.
    const completedCheckPendingCount = tasks.filter(
      (task) => task.status === 'COMPLETED_CHECK_PENDING'
    ).length

    // 'IN_PROGRESS' (Devam Etmekte) durumundaki görevlerin sayısını hesaplar.
    const inProgressCount = tasks.filter(
      (task) => task.status === 'IN_PROGRESS'
    ).length
    return res.status(200).json({
      status: 'success',
      data: {
        tasks: tasks,
        completedTaskCount: completedCheckPendingCount, // Tamamlanan task sayısını döner.
        inProgressTaskCount: inProgressCount, // Devam etmekte olan task sayısını döner.
        allTaskCount: tasks.length, // Toplam task sayısını döner.,
      },
    })
  }
  return res
    .status(500)
    .json({ status: 'error', message: 'Method not allowed' })
}

export default handler
