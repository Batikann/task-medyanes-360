// handler.js

import { markNotificationsAsRead } from '../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { userId } = req.body

    if (!userId) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid request' })
    }

    const result = await markNotificationsAsRead(userId)

    if (result.status === 'success') {
      res.status(200).json({ status: 'success', result })
    } else {
      res.status(500).json(result)
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' })
  }
}

export default handler
