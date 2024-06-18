import { RiDashboardFill } from 'react-icons/ri'

import { IoIosAddCircle } from 'react-icons/io'

export const adminNavLinks = [
  {
    id: '1',
    title: 'Kontrol Paneli',
    route: '/admindashboard',
    icon: RiDashboardFill,
  },
  {
    id: '3',
    title: 'Proje Ekle',
    route: '/admindashboard/add-task',
    icon: IoIosAddCircle,
  },
]

export const userNavLinks = [
  // {
  //   id: '1',
  //   title: 'My Tasks',
  //   route: '/userdashboard/my-tasks',
  // },
]
