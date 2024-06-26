// handler.js

import { markSpecificNotificationAsRead } from '../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { userId, notificationId } = req.body

    if (!userId || !notificationId) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid request' })
    }

    const result = await markSpecificNotificationAsRead(userId, notificationId)

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
