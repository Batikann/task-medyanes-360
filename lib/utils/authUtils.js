//Kuıllanıcının rolünü kontrol ettiğimiz fonksiyonumuz
export const checkRole = () => {
  const user = JSON.parse(localStorage.getItem('currentUser'))

  if (user != null && user.role != 'ADMIN') {
    return { role: 'USER' }
  } else if (user != null && user.role != 'USER') {
    return { role: 'ADMIN' }
  }
  return { role: '' }
}
