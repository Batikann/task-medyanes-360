'use client'
import { useEffect, useState } from 'react'
import { addTaskValidationSchemma } from './addTaskValidationSchema.jsx'
import { getAPI, postAPI } from '../../../../services/fetchAPI'
import { getDateNow } from '../../../../lib/utils/dateUtils.js'

import { useRouter } from 'next/navigation'
import Loading from '../../../../components/loading/index.jsx'

import TaskForm from '../../../../components/TaskForm/index.jsx'

const AddTaskPage = () => {
  const [users, setUsers] = useState([{ id: '', username: '' }])
  const [minDate, setMinDate] = useState('')

  const router = useRouter()

  useEffect(() => {
    const getUsers = async () => {
      const usersData = await getAPI('/user/get-users')
      setUsers(usersData.data.users)
    }

    getUsers()
    setMinDate(getDateNow())
  }, [])

  if (users.length <= 1) {
    return <Loading />
  }

  const initialValues = {
    title: '',
    description: '',
    priority: 'LOW',
    createdAt: '',
    status: 'IN_PROGRESS',
    assignedUsers: [],
    subtasks: [],
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await postAPI('/tasks/create-task', values)
      if (res.status === 'success') {
        setTimeout(() => {
          router.push('/admindashboard')
        }, 3000)
      } else {
        console.log(res.message)
      }
    } catch (error) {
      console.error('API request failed:', error)
    }
    setSubmitting(false)
  }

  if (users.length <= 1) {
    return <Loading />
  }

  return (
    <TaskForm
      initialValues={initialValues}
      validationSchema={addTaskValidationSchemma}
      onSubmit={handleSubmit}
      users={users}
      minDate={minDate}
    />
  )
}
export default AddTaskPage
