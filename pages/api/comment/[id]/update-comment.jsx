import { updateDataByAny } from '../../../../services/servicesOperations'

const handler = async (req, res) => {
  if (!req) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Bir hata oluştu!' })
  }

  if (req.method === 'POST' && req.body) {
    const { content, status } = req.body

    const data = {
      content,
      status,
    }

    try {
      const result = await updateDataByAny(
        'Comment',
        { id: req.query.id },
        data
      )

      return res.status(200).json({ status: 'success', data: result })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message })
    }
  } else {
    return res
      .status(405)
      .json({ status: 'error', message: 'Method Not Allowed' })
  }
}

export default handler
