'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Menu, MenuItem, IconButton, Badge } from '@mui/material'

import { FiBell } from 'react-icons/fi'
import MobileNav from '../MobileNav'
import BurgerMenu from '/public/burger-menu.svg'
import Image from 'next/image'
import DropdownNavbar from '../../components/DropdownNavbar'
import Loading from '../loading'
import socket from '../../lib/utils/socket'
import { getAPI, postAPI } from '../../services/fetchAPI'

const Navbar = ({ title, navLinks, route }) => {
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [refreshPage, setRefreshPage] = useState(false)

  const handleLogout = () => {
    signOut()
  }

  const pathName = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      // Socket.io kullanarak yeni bildirimleri dinle
      socket.emit('join', session.user.id)

      socket.on('new_notification', (notification) => {
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ])
      })

      // Kullanıcının mevcut bildirimlerini yükle
      const fetchNotifications = async () => {
        try {
          const response = await getAPI(
            `/notifications/${session.user.id}/get-notifications`
          )

          if (response.status === 'success') {
            setNotifications(response.data)
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error)
        }
      }

      fetchNotifications()

      // const intervalId = setInterval(() => {
      //   fetchNotifications()
      // }, 30000)

      return () => {
        // clearInterval(intervalId)
        socket.emit('leave', session.user.id)
        socket.off('new_notification')
      }
    }
  }, [session, refreshPage])

  const handleNotificationClick = async (event) => {
    setAnchorEl(event.currentTarget)
    if (notifications.some((notification) => !notification.isRead)) {
      try {
        const response = await postAPI('/notifications/read', {
          userId: session.user.id,
        })
      } catch (error) {
        console.error('Failed to mark notifications as read:', error)
      }
    }
  }

  const handleNotificationClose = () => {
    setAnchorEl(null)
    setRefreshPage(!refreshPage)
  }

  const open = Boolean(anchorEl)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="border-b shadow-md p-7 w-full">
      <div className="max-w-[1540px] mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          <Link href={route} className="flex items-center gap-2">
            <div>
              Task<span className="text-blue-700 font-bold">Manager</span>
            </div>
            <span className="hidden md:block">- {title}</span>
          </Link>
        </h1>
        <div className="flex items-center gap-3">
          <ul className="gap-6 items-center hidden md:flex font-medium text-gray-600">
            {navLinks.map((navLink) => (
              <li
                key={navLink.id}
                className={`hover:text-blue-500 transition-all duration-500 ease-in-out ${
                  pathName === navLink.route ? 'text-blue-500' : ''
                }`}
              >
                <Link href={navLink.route} className="flex items-center gap-3">
                  {navLink.title}
                  <navLink.icon size={20} />
                </Link>
              </li>
            ))}
          </ul>
          {status === 'authenticated' ? (
            <DropdownNavbar
              name={session.user.name}
              logoutFunc={handleLogout}
            />
          ) : (
            <Loading width={'h-6'} height={'h-6'} />
          )}
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={unreadCount} color="error">
              <FiBell />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleNotificationClose}
            PaperProps={{
              style: {
                maxHeight: 65 * 4.5,
              },
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <MenuItem
                  key={index}
                  onClick={handleNotificationClose}
                  className="break-words whitespace-normal max-w-lg"
                >
                  <div
                    className={`p-2 px-4 w-full text-sm   ${
                      !notification.isRead &&
                      'bg-blue-200 animate-pulse duration-200 flex items-center justify-between rounded-md'
                    }`}
                  >
                    <p className="break-words whitespace-normal ">
                      {notification.message}
                    </p>
                  </div>
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleNotificationClose}>
                No notifications
              </MenuItem>
            )}
          </Menu>
          {navLinks.length > 0 && (
            <div className="md:hidden flex items-center gap-4">
              <button
                className="cursor-pointer"
                onClick={() => setToggleMobileMenu(!toggleMobileMenu)}
              >
                <Image src={BurgerMenu} className="w-6 h-6" alt="menu-icon" />
              </button>
              <MobileNav
                navLinks={navLinks}
                toggleMobileMenu={toggleMobileMenu}
                setToggleMobileMenu={setToggleMobileMenu}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
