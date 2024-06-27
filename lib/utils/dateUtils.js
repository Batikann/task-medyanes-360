//Gelen date bilgisini yeninden formatlıyoruz
export const getDateNow = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const calculateDuration = (date) => {
  const now = new Date()
  const createdAt = new Date(date)
  const durationInMilliseconds = now - createdAt
  const durationInDays = Math.floor(
    durationInMilliseconds / (1000 * 60 * 60 * 24)
  )
  return durationInDays < 0 ? 0 : durationInDays
}
