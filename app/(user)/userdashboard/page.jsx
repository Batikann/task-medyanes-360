'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../services/fetchAPI'

import TaskColumn from '../../../components/TaskColumn'
import { useSession } from 'next-auth/react'
import Loading from '../../../components/loading'
import UserFilterDropdown from '../../../components/UserFilterDropdown'
import {
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
} from '@mui/material'
import { normalizeInput } from '../../../lib/utils/formatter'
import { useRouter } from 'next/navigation'
import UserTable from '../../../components/UserTable'
import {
  priorityTabForUser,
  adminTaskTabValues,
} from '../../../lib/constants/tabsValues.js'
import { filterTasks } from '../../../lib/utils/filterUtils'

function getTasksByPriority(allTasks, priority) {
  switch (priority) {
    case 'LOW':
      return allTasks.lowPriorityTasks || []
    case 'MEDIUM':
      return allTasks.mediumPriorityTasks || []
    case 'HIGH':
      return allTasks.highPriorityTasks || []
    default:
      return []
  }
}

const UserDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)

  const { data: session } = useSession()
  const [filteredTasks, setFilteredTasks] = useState([])
  const [projectName, setProjectName] = useState('')

  const [viewMode, setViewMode] = useState('card')
  const [tableValue, setTableValue] = useState()
  const [statusType, setStatusType] = useState('ALL')

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value
    setStatusType(selectedStatus)
    // Add logic to filter tasks based on selected status
  }

  useEffect(() => {
    const getTaskForUser = async () => {
      try {
        const res = await getAPI(`/tasks/${session.user.id}/get-tasks-user`)
        if (res.status === 'success') {
          setTasks(res.tasks)
          setFilteredTasks(res.tasks)
          setTableValue(res.tasks.tasks)
          setLoading(false)
        } else {
          throw new Error(res.message)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (session) {
      getTaskForUser()
    }
  }, [session])

  useEffect(() => {
    const filtered = filterTasks(tasks, statusType, projectName)
    setFilteredTasks(filtered)
    setTableValue(filtered.tasks)
  }, [tasks, statusType, projectName])

  if (!filteredTasks || Object.keys(filteredTasks).length === 0) {
    return (
      <div className="mt-5">
        <Loading width={'h-8'} height={'h-8'} />
      </div>
    )
  }
  console.log(statusType)

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <TextField
          label="Proje Adı"
          id="title"
          variant="filled"
          style={{ width: 400 }}
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <div className="flex items-center space-x-4">
          <Select
            value={statusType}
            onChange={handleStatusChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            className="ml-4 w-[200px]"
          >
            {adminTaskTabValues.map((val) => (
              <MenuItem key={val.id} value={val.route}>
                {val.name}
              </MenuItem>
            ))}
          </Select>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => {
              if (newView !== null) {
                setViewMode(newView)
              }
            }}
            aria-label="view mode"
          >
            <ToggleButton value="card" aria-label="card view">
              Kart
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              Tablo
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
          {priorityTabForUser.map((priority) => (
            <TaskColumn
              key={priority.priority}
              priority={priority}
              tasks={getTasksByPriority(filteredTasks, priority.priority)}
              loading={loading}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-8">
          <UserTable tasks={tableValue} loading={loading} loading2={loading2} />
        </div>
      )}
    </>
  )
}

export default UserDashboard
