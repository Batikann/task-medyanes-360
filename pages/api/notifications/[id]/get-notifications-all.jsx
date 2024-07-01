import prisma from '../../../../lib/prisma'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query

    try {
      // Veritabanı sorgusu ile tüm bildirimleri tarihe göre sıralar
      const notifications = await prisma.notification.findMany({
        where: {
          userId: id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.status(200).json({ status: 'success', data: notifications })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message })
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' })
  }
}

export default handler
