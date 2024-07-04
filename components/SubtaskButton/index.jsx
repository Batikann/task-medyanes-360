import { toast } from 'react-toastify'
import { postAPI } from '../../services/fetchAPI'
import { useState } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { FaEllipsisH, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const SubtaskComponent = ({
  role,
  subtask,
  setSubtasks,
  setRefreshPage,
  refreshPage,
}) => {
  const today = new Date()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [selectedStatus, setSelectedStatus] = useState(subtask.status)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleStatusToggle = async (subtaskId, newStatus) => {
    let completedDate = newStatus ? new Date() : null
    const data = { subtaskId, status: newStatus, completedDate }
    try {
      const res = await postAPI('/tasks/subtask/update-subtask-status', data)

      if (res.status === 'success') {
        const message = newStatus ? 'Görev Tamamlandı' : 'Görev Devam Etmekte'
        toast.success(message)
        setSubtasks((prevSubtasks) =>
          prevSubtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, status: newStatus, completedDate }
              : subtask
          )
        )
        setSelectedStatus(newStatus)
        setRefreshPage(!refreshPage)
      } else {
        console.error('Failed to update subtask status')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
    handleClose()
  }

  const isTodayOrLater = (dateString) => {
    const subtaskDate = new Date(dateString)
    const currentDate = new Date(today)
    return (
      subtaskDate.getFullYear() > currentDate.getFullYear() ||
      (subtaskDate.getFullYear() === currentDate.getFullYear() &&
        subtaskDate.getMonth() > currentDate.getMonth()) ||
      (subtaskDate.getFullYear() === currentDate.getFullYear() &&
        subtaskDate.getMonth() === currentDate.getMonth() &&
        subtaskDate.getDate() >= currentDate.getDate())
    )
  }

  return (
    <div>
      {role === 'USER' && isTodayOrLater(subtask.createdAt) && (
        <>
          <div>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <FaEllipsisH />
            </IconButton>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '250px',
              },
            }}
          >
            <MenuItem
              onClick={() => handleStatusToggle(subtask.id, true)}
              selected={selectedStatus === true}
            >
              <FaCheckCircle
                style={{
                  marginRight: '8px',
                  color: selectedStatus === true ? 'green' : 'inherit',
                }}
              />
              Tamamlandı
            </MenuItem>
            <MenuItem
              onClick={() => handleStatusToggle(subtask.id, false)}
              selected={selectedStatus === false}
            >
              <FaTimesCircle
                style={{
                  marginRight: '8px',
                  color: selectedStatus === false ? 'red' : 'inherit',
                }}
              />
              Devam Ediyor
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  )
}

export default SubtaskComponent
