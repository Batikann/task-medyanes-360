'use client'

import { addTaskValidationSchemma } from './addTaskValidationSchema.jsx'
import { postAPI } from '../../../../services/fetchAPI'

import { useRouter } from 'next/navigation'

import TaskForm from '../../../../components/TaskForm/index.jsx'
import { toast } from 'react-toastify'

const AddTaskPage = () => {
  const router = useRouter()

  //ADD işlemini gerçekleştiren fonksiyonumuz
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await postAPI('/tasks/create-task', values)
      if (res.status === 'success') {
        toast.success('Task Başarıyla Eklendi')
        router.push('/admindashboard?task=all')
      } else {
        console.log(res.message)
      }
    } catch (error) {
      console.error('API request failed:', error)
    }
    setSubmitting(false)
  }

  return (
    //Genel Task Formumumuz ADD/UPDATE işlemlerimiz için
    <TaskForm
      validationSchema={addTaskValidationSchemma}
      onSubmit={handleSubmit}
    />
  )
}
export default AddTaskPage
