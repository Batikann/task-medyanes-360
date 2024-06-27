import prisma from '../../../../lib/prisma'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query

    try {
      // Veritabanı sorgusu ile okunmamış tüm bildirimleri ve okunmuşlardan sadece 5 tanesini getirir
      const unreadNotifications = await prisma.notification.findMany({
        where: {
          userId: id,
          isRead: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const readNotifications = await prisma.notification.findMany({
        where: {
          userId: id,
          isRead: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5, // Sadece 5 tanesini alır
      })

      // Okunmamış ve okunmuş bildirimleri birleştirir
      const notifications = [...unreadNotifications, ...readNotifications]

      res.status(200).json({ status: 'success', data: notifications })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message })
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' })
  }
}

export default handler
