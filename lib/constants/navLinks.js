import { RiDashboardFill } from 'react-icons/ri'
import { FaTasks } from 'react-icons/fa'
import { IoIosAddCircle } from 'react-icons/io'

export const adminNavLinks = [
  {
    id: '1',
    title: 'Kontrol Paneli',
    route: '/admindashboard',
    icon: RiDashboardFill,
  },
  {
    id: '2',
    title: 'Görevler',
    route: '/admindashboard/task?task=all',
    icon: FaTasks,
  },
  {
    id: '3',
    title: 'Görev Ekle',
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
