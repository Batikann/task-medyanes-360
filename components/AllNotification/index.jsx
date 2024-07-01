'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { IoMdNotifications } from 'react-icons/io'
import { getAPI, postAPI } from '../../services/fetchAPI'
import { formatDate } from '../../lib/utils/formatter'
import { FaLongArrowAltLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { BsCheckAll } from 'react-icons/bs'

const AllNotification = () => {
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState([])
  const [refreshPage, setRefreshPage] = useState(true)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')
  const itemsPerPage = 6
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.id) {
      const fetchNotifications = async () => {
        try {
          const response = await getAPI(
            `/notifications/${session.user.id}/get-notifications-all`
          )

          if (response.status === 'success') {
            setNotifications(response.data)
            setLoading(false)
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error)
        }
      }

      fetchNotifications()
    }
  }, [session, refreshPage])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  const readNotification = async (userId, notificationId) => {
    try {
      const response = await postAPI('/notifications/read', {
        userId: userId,
        notificationId: notificationId,
      })
      if (response.status === 'success') {
        toast.success('Bildirim Başarıyla Okundu Olarak İşaretlendi!')
        setRefreshPage(!refreshPage)
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await postAPI('/notifications/read-all', {
        userId: session.user.id,
      })
      if (response.status === 'success') {
        toast.success('Tüm Bildirimler Okundu Olarak İşaretlendi!')
        setRefreshPage(!refreshPage)
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setPage(1) // Sayfayı sıfırla
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'read') return notification.isRead
    if (filter === 'unread') return !notification.isRead
    return true
  })

  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <div className="pt-7 px-6 flex-1 w-full max-w-[1540px] mx-auto 2xl:px-0 mb-6">
      <div>
        <p className="flex items-center gap-3" onClick={() => router.back()}>
          <FaLongArrowAltLeft
            size={30}
            className="hover:text-blue-700 duration-500 transition-all ease-in-out hover:scale-105 cursor-pointer"
          />
        </p>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h1 className="flex items-center gap-3 text-4xl uppercase font-bold mt-4 hover:animate-bounce cursor-pointer relative">
          <IoMdNotifications className="text-5xl text-blue-500" />
          <span className="text-2xl">Bildirimler</span>
        </h1>
        <div className="w-full max-w-[800px] flex justify-between items-center mt-6">
          <FormControl variant="outlined" className="w-1/3">
            <InputLabel>Filtrele</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              label="Filtrele"
            >
              <MenuItem value="all">Tüm Bildirimler</MenuItem>
              <MenuItem value="read">Okunmuş Bildirimler</MenuItem>
              <MenuItem value="unread">Okunmamış Bildirimler</MenuItem>
            </Select>
          </FormControl>
          <button
            className="bg-blue-700 text-white p-3 px-5 rounded-lg text-sm hover:bg-blue-500 duration-500 transition-all ease-in-out flex items-center gap-3"
            onClick={markAllAsRead}
          >
            <BsCheckAll size={20} />
            Tümünü Okundu Olarak İşaretle
          </button>
        </div>
        <div className="mt-6 w-full max-w-[800px]">
          {paginatedNotifications.length > 0 ? (
            paginatedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-b border-gray-200 py-4 px-6 flex items-center justify-between ${
                  !notification.isRead ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex flex-col gap-4">
                  <p className="text-xl">{notification.message}</p>
                  <span className="text-gray-500 text-sm">
                    {formatDate(notification.createdAt)}
                  </span>
                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        readNotification(session.user.id, notification.id)
                      }
                      className="flex items-start text-sm font-bold hover:text-blue-600 duration-500 ease-in-out transition-all "
                    >
                      Okundu Olarak İşaretle
                    </button>
                  )}
                </div>
                {!notification.isRead && (
                  <div className="relative">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Not found any message</p>
          )}
        </div>
        <Box mt={4}>
          <Pagination
            count={Math.ceil(filteredNotifications.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            color="primary"
          />
        </Box>
      </div>
    </div>
  )
}

export default AllNotification
