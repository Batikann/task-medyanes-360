//localden geçerli user bilgisini getiriyoruz
const getUser = () => {
  const user = localStorage.getItem('currentUser')

  return JSON.parse(user)
}

export default getUser
