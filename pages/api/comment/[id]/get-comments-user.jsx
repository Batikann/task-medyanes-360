import { getDataByManyRelitionalTable } from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query

    try {
      const taskId = id
      const where = { taskId: taskId }
      const include = {
        user: {
          select: {
            email: true,
            username: true,
            id: true,
          },
        }, // Comment ile ilişkilendirilmiş User bilgilerini de comment ile beraber getiriyor.
      }

      const comments = await getDataByManyRelitionalTable(
        'Comment',
        where,
        include
      )

      return res.status(200).json({ status: 'success', comments })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message })
    }
  }

  return res
    .status(405) // Method not allowed HTTP status code
    .json({ status: 'error', message: 'Method not allowed' })
}

export default handler
