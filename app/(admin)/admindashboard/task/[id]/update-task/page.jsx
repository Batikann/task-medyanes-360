'use client'

import { useEffect, useState } from 'react'
import { getAPI, postAPI } from '../../../../../../services/fetchAPI'
import { useRouter } from 'next/navigation'
import Loading from '../../../../../../components/loading'
import TaskForm from '../../../../../../components/TaskForm'
import { updateTaskValidationSchema } from './updateTaskValidationSchema'

const UpdateTaskPage = ({ params }) => {
  const [task, setTask] = useState(null)
  const [users, setUsers] = useState([])
  const [minDate, setMinDate] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskPromise = getAPI(`/tasks/${params.id}/get-task`)
        const usersPromise = getAPI('/user/get-users')

        const [taskRes, usersRes] = await Promise.all([
          taskPromise,
          usersPromise,
        ])

        setTask(taskRes.task)
        setUsers(usersRes.data.users)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [params.id])

  const initialValues = {
    id: task ? task.id : '',
    title: task ? task.title : '',
    description: task ? task.description : '',
    priority: task ? task.priority : 'LOW',
    createdAt: task ? new Date(task.createdAt).toISOString().slice(0, 10) : '',
    status: task ? task.status : 'IN_PROGRESS',
    assignedUsers: task
      ? task.assignedUsers.map((assignedUser) => assignedUser.userId)
      : [],
    subtasks: task
      ? task.subtasks.map((subtask) => ({
          title: subtask.title,
          createdAt: new Date(subtask.createdAt).toISOString().slice(0, 10),
          status: subtask.status,
        }))
      : [],
  }

  const handleSubmit = async (values) => {
    const newData = { ...values, id: params.id }
    try {
      const res = await postAPI(`/tasks/update-task`, newData)
      if (res.status === 'success') {
        router.push('/admindashboard/task')
      } else {
        console.log(res.message)
      }
    } catch (error) {
      console.error('API request failed:', error)
    }
  }

  if (!task) {
    return <Loading />
  }

  return (
    <TaskForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      users={users}
      minDate={minDate}
      validationSchema={updateTaskValidationSchema}
    />
  )
}

export default UpdateTaskPage
