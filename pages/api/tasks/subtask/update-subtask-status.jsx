import { updateDataByAny } from '../../../../services/servicesOperations/index.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ status: 'error', message: 'Method not allowed' })
  }

  const { subtaskId, status } = req.body

  if (!subtaskId) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Subtask ID is required' })
  }

  try {
    await updateDataByAny('Subtask', { id: subtaskId }, { status })
    return res.status(200).json({ status: 'success' })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}
