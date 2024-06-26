'use client'

import { useEffect, useState } from 'react'
import { getAPI, postAPI } from '../../../../../../services/fetchAPI'
import { useRouter } from 'next/navigation'
import Loading from '../../../../../../components/loading'
import TaskForm from '../../../../../../components/TaskForm'
import { updateTaskValidationSchema } from './updateTaskValidationSchema'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
const UpdateTaskPage = ({ params }) => {
  const [task, setTask] = useState(null)
  const router = useRouter()
  const { data: session, status } = useSession()
  //Kullanıcı sayfaya girerken gelen id ye göre geçerli taskı getiriyoruz.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await getAPI(`/tasks/${params.id}/get-task`)
        setTask(taskRes.task)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [params.id])

  //Task güncelleme fonksiyonumuz
  const handleSubmit = async (values) => {
    const newData = { ...values, id: params.id, userId: session.user.id }
    console.log(newData)
    try {
      const res = await postAPI(`/tasks/update-task`, newData)
      if (res.status === 'success') {
        router.push('/admindashboard?task=all')
        toast.success('Task Başarıyla Güncellendi')
      } else {
        console.log(res.message)
      }
    } catch (error) {
      console.error('API request failed:', error)
    }
  }

  //Task yüklenene kadar kullanıcı deneyimi için bir loading gösteriyoruz.
  if (!task) {
    return <Loading width={'h-8'} height={'h-8'} />
  }

  return (
    <TaskForm
      onSubmit={handleSubmit}
      validationSchema={updateTaskValidationSchema}
      task={task}
    />
  )
}

export default UpdateTaskPage
