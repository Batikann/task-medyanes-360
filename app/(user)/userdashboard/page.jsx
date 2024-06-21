'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../../services/fetchAPI'
import { priorityTabForUser } from '../../../lib/constants/tabsValues'
import TaskColumn from '../../../components/TaskColumn'
import { useSession } from 'next-auth/react'
import Loading from '../../../components/loading'
import UserFilterDropdown from '../../../components/UserFilterDropdown'
import { TextField } from '@mui/material'
import { normalizeInput } from '../../../lib/utils/formatter'
import { useRouter, useSearchParams } from 'next/navigation'

function getTasksByPriority(allTasks, priority) {
  switch (priority) {
    case 'LOW':
      return allTasks.lowPriorityTasks
    case 'MEDIUM':
      return allTasks.mediumPriorityTasks
    case 'HIGH':
      return allTasks.highPriorityTasks
    default:
      return []
  }
}

const UserDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const [filteredTasks, setFilteredTasks] = useState([])
  const [projectName, setProjectName] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    //Gelen kullanıcı bilgilerine göre o kullanıcının görev aldığı taskleri getiren fonksiyonumuz
    const getTaskForUser = async () => {
      try {
        const res = await getAPI(`/tasks/${session.user.id}/get-tasks-user`)

        if (res.status === 'success') {
          setTasks(res.tasks)
          setFilteredTasks(res.tasks)
          setLoading(false)
        } else {
          throw new Error(res.message)
        }
      } catch (error) {
        console.error(error)
      }
    }

    getTaskForUser()
  }, [session])

  useEffect(() => {
    const filterAndSortTasks = () => {
      let updatedTasks = { ...tasks }

      if (!projectName && !sortOrder) {
        setFilteredTasks(tasks)
        return
      }

      if (projectName) {
        updatedTasks.lowPriorityTasks = tasks.lowPriorityTasks.filter((task) =>
          task.title.toLowerCase().includes(projectName.toLowerCase())
        )
        updatedTasks.mediumPriorityTasks = tasks.mediumPriorityTasks.filter(
          (task) => task.title.toLowerCase().includes(projectName.toLowerCase())
        )
        updatedTasks.highPriorityTasks = tasks.highPriorityTasks.filter(
          (task) => task.title.toLowerCase().includes(projectName.toLowerCase())
        )
      }

      if (sortOrder) {
        const sortTasks = (taskArray) => {
          return taskArray.sort((a, b) => {
            if (sortOrder === 'asc') {
              return new Date(a.createdAt) - new Date(b.createdAt)
            } else {
              return new Date(b.createdAt) - new Date(a.createdAt)
            }
          })
        }
        updatedTasks.lowPriorityTasks = sortTasks(updatedTasks.lowPriorityTasks)
        updatedTasks.mediumPriorityTasks = sortTasks(
          updatedTasks.mediumPriorityTasks
        )
        updatedTasks.highPriorityTasks = sortTasks(
          updatedTasks.highPriorityTasks
        )
      }

      setFilteredTasks(updatedTasks)
    }

    filterAndSortTasks()
  }, [tasks, projectName, sortOrder])

  useEffect(() => {
    const handleURLUpdate = () => {
      const query = normalizeInput(projectName) // Normalize the project name input
      const selected = normalizeInput(sortOrder) // Normalize the sort order input

      if (query || selected) {
        // If either query or selected has a value, update the URL
        let url = `/userdashboard?`
        if (query) {
          url += `query=${query}`
        }
        if (selected) {
          url += `${query ? '&' : ''}selected=${selected}`
        }
        router.push(url, undefined, { shallow: true })
      } else {
        // If both query and selected are empty, clean the URL
        router.push('/userdashboard', undefined, { shallow: true })
      }
    }

    handleURLUpdate()
  }, [projectName, sortOrder, router])

  //Eğer kullanıcının görev aldığı bir task yok ise böyle bir mesaj gösterilir
  if (tasks.length <= 0) {
    return (
      <div className="   mt-5 ">
        <Loading width={'h-8'} height={'h-8'} />
      </div>
    )
  }

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
        <UserFilterDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
        {priorityTabForUser.map((priority) => (
          <TaskColumn
            priority={priority}
            tasks={getTasksByPriority(filteredTasks, priority.priority)}
            loading={loading}
          />
        ))}
      </div>
    </>
  )
}
export default UserDashboard
