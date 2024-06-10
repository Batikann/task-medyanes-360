import { getDataByMany } from '../../../services/servicesOperations'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const users = await getDataByMany('User', { role: 'USER' }).then(
      (users) => {
        return users.map((user) => ({
          id: user.id,
          username: user.name,
          email: user.email,
        }))
      }
    )

    // get isteği  yaparken herhangi bir hata alırsak bunu döndür.
    if (users.error) {
      return res.status(500).json({
        status: 'error',
        message: 'Veritabanında bir hata oluştu!',
        error: result.error,
      })
    }
    return res.status(200).json({ status: 'success', data: { users } })
  }
  return res
    .status(500)
    .json({ status: 'error', message: 'Method not allowed' })
}

export default handler
