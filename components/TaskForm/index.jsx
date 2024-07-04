'use client'
import { Formik, FieldArray, Form, Field } from 'formik'
import TextInput from '../Inputs/TextInput.jsx'
import SelectInput from '../Inputs/SelectInput.jsx'
import DateInput from '../Inputs/DateInput.jsx'
import { IoTrashBin } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import Loading from '../loading/index.jsx'
import { getDateNow } from '../../lib/utils/dateUtils.js'
import { getAPI } from '../../services/fetchAPI/index.js'
import { useSession } from 'next-auth/react'
import { FaCalendar, FaPlus } from 'react-icons/fa'
import { TbSubtask, TbFileDescription, TbStatusChange } from 'react-icons/tb'
import { MdTitle, MdLowPriority } from 'react-icons/md'
import UserSelect from '../UserSelect'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
const TaskForm = ({ task = null, validationSchema, onSubmit }) => {
  const [users, setUsers] = useState([{ id: '', username: '' }])
  const { data: session } = useSession()

  const [loading, setLoading] = useState(true)
  const [minDate, setMinDate] = useState('')
  const router = useRouter()
  useEffect(() => {
    const getUsers = async () => {
      const usersData = await getAPI('/user/get-users')
      setUsers(usersData.data.users)
      setLoading(false)
    }

    getUsers()
    setMinDate(getDateNow())
  }, [])

  if (loading) {
    return <Loading width={'h-8'} height={'h-8'} />
  }

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
          id: subtask.id,
          title: subtask.title,
          createdAt: new Date(subtask.createdAt).toISOString().slice(0, 10),
          status: subtask.status,
          userId: subtask.userId || session.user.id,
        }))
      : [],
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => {
        const minSubtaskDate = formikProps.values.createdAt || minDate
        const isUpdate = !!task
        const minCreatedAtDate = isUpdate ? initialValues.createdAt : minDate

        return (
          <>
            <div>
              <button
                className="flex items-center gap-4 mb-6 cursor-pointer border justify-start p-2 px-5  rounded-lg bg-gray-200 hover:scale-105 hover:text-blue-600"
                onClick={() => router.back()}
              >
                <FaArrowLeftLong size={25} className="mr-2" />
                <p className="font-semibold">Geri Git</p>
              </button>
            </div>
            <Form className="flex flex-col gap-5 ">
              <TextInput
                label={
                  <span className="flex items-center gap-3">
                    <MdTitle size={23} />
                    Başlık
                  </span>
                }
                name="title"
                type="text"
                required
              />
              {formikProps.errors.title && formikProps.touched.title && (
                <div className="text-red-600 text-sm mt-1">
                  {formikProps.errors.title}
                </div>
              )}
              <TextInput
                label={
                  <span className="flex items-center gap-3">
                    <TbFileDescription size={20} />
                    Açıklama
                  </span>
                }
                name="description"
                as="textarea"
              />
              {formikProps.errors.description &&
                formikProps.touched.description && (
                  <div className="text-red-600 text-sm mt-1">
                    {formikProps.errors.description}
                  </div>
                )}
              <SelectInput
                label={
                  <span className="flex items-center gap-3">
                    <MdLowPriority size={23} />
                    Öncelik
                  </span>
                }
                name="priority"
                options={[
                  { value: 'LOW', label: 'Low' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HIGH', label: 'High' },
                ]}
              />
              {formikProps.errors.priority && formikProps.touched.priority && (
                <div className="text-red-600 text-sm mt-1">
                  {formikProps.errors.priority}
                </div>
              )}
              <DateInput
                label={
                  <span className="flex items-center gap-3">
                    <FaCalendar />
                    Oluşturma Tarihi
                  </span>
                }
                name="createdAt"
                min={minCreatedAtDate}
              />
              {formikProps.errors.createdAt &&
                formikProps.touched.createdAt && (
                  <div className="text-red-600 text-sm mt-1">
                    {formikProps.errors.createdAt}
                  </div>
                )}
              <SelectInput
                label={
                  <span className="flex items-center gap-3">
                    <TbStatusChange size={23} />
                    Durum
                  </span>
                }
                name="status"
                options={[
                  {
                    value: 'COMPLETED_CHECK_PENDING',
                    label: 'Tamamlanan Projeler',
                  },
                  { value: 'IN_PROGRESS', label: 'Devam Eden Projeler' },
                  {
                    value: 'UPDATE_PENDING',
                    label: 'Güncelleme Bekleyen Projeler',
                  },
                  {
                    value: 'INFO_REQUEST_PENDING',
                    label: 'Bilgi Talebi Beklenen Projeler',
                  },
                  {
                    value: 'CUSTOMER_WAITING',
                    label: 'Müşteri Beklenen Projeler',
                  },
                ]}
              />
              {formikProps.errors.status && formikProps.touched.status && (
                <div className="text-red-600 text-sm mt-1">
                  {formikProps.errors.status}
                </div>
              )}
              <UserSelect users={users} />
              <div className="flex flex-col gap-2">
                <label className="flex gap-3 items-center">
                  <TbSubtask size={23} />
                  <span>Alt Başlıklar</span>
                </label>
                <FieldArray name="subtasks">
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-3">
                      {formikProps.values.subtasks.map((subtask, index) => (
                        <div
                          key={index}
                          className="flex gap-4 items-center justify-center w-full h-full"
                        >
                          <div className="flex-1">
                            <TextInput
                              label="Başlık"
                              name={`subtasks[${index}].title`}
                              placeholder="Subtask Title"
                            />
                            {formikProps.errors.subtasks &&
                              formikProps.errors.subtasks[index] &&
                              formikProps.errors.subtasks[index].title &&
                              formikProps.touched.subtasks &&
                              formikProps.touched.subtasks[index] &&
                              formikProps.touched.subtasks[index].title && (
                                <div className="text-red-600 text-sm mt-1">
                                  {formikProps.errors.subtasks[index].title}
                                </div>
                              )}
                          </div>
                          <DateInput
                            label="Oluşturma Tarihi"
                            name={`subtasks[${index}].createdAt`}
                            min={minSubtaskDate}
                          />
                          {formikProps.errors.subtasks &&
                            formikProps.errors.subtasks[index] &&
                            formikProps.errors.subtasks[index].createdAt &&
                            formikProps.touched.subtasks &&
                            formikProps.touched.subtasks[index] &&
                            formikProps.touched.subtasks[index].createdAt && (
                              <div className="text-red-600 text-sm mt-1">
                                {formikProps.errors.subtasks[index].createdAt}
                              </div>
                            )}

                          <Field
                            type="hidden"
                            name={`subtasks[${index}].userId`}
                            value={session.user.id}
                          />
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="flex justify-center items-center w-8 h-8"
                            >
                              <IoTrashBin size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        className="border p-2 w-full mt-2 flex items-center gap-3 justify-center"
                        type="button"
                        onClick={() =>
                          push({
                            title: '',
                            createdAt: '',
                            status: false,
                            userId: session.user.id,
                          })
                        }
                      >
                        <FaPlus />
                        <span> Alt Başlık Ekle</span>
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              <button
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-500 font-semibold transition-all ease-in-out duration-500 transform"
                type="submit"
              >
                {initialValues.id ? 'Proje Güncelle' : 'Proje Ekle'}
              </button>
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

export default TaskForm
