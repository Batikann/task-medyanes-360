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
import { TextField } from '@mui/material'
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
          description: subtask.description,
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
                    <MdTitle size={23} className="text-slate-500" />
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
                    <TbFileDescription size={20} className="text-blue-400" />
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
                    <MdLowPriority size={23} className="text-green-400" />
                    Öncelik
                  </span>
                }
                name="priority"
                options={[
                  { value: 'LOW', label: 'Düşük' },
                  { value: 'MEDIUM', label: 'Orta' },
                  { value: 'HIGH', label: 'Yüksek' },
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
                    <FaCalendar className="text-amber-400" />
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
                    <TbStatusChange size={23} className="text-rose-400" />
                    Durum
                  </span>
                }
                name="status"
                options={[
                  {
                    value: 'COMPLETED_CHECK_PENDING',
                    label: 'Tamamlanan Proje',
                  },
                  { value: 'IN_PROGRESS', label: 'Devam Eden Proje' },
                  {
                    value: 'UPDATE_PENDING',
                    label: 'Güncelleme Bekleyen Proje',
                  },
                  {
                    value: 'INFO_REQUEST_PENDING',
                    label: 'Bilgi Talebi Beklenen Proje',
                  },
                  {
                    value: 'CUSTOMER_WAITING',
                    label: 'Müşteri Beklenen Proje',
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
                  <TbSubtask size={23} className="text-lime-400" />
                  <span>Alt Başlıklar</span>
                </label>
                <FieldArray name="subtasks">
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-3 mt-2">
                      {formikProps.values.subtasks.map((subtask, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-4 w-full h-full border py-3 px-4 border-gray-700 rounded-lg"
                        >
                          <div className="flex-1">
                            <TextInput
                              label="Başlık"
                              name={`subtasks[${index}].title`}
                              placeholder="Başlık"
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

                          <div className="flex-1">
                            <TextField
                              label="Açıklama"
                              name={`subtasks[${index}].description`}
                              multiline
                              rows={4}
                              variant="outlined"
                              fullWidth
                              onChange={formikProps.handleChange}
                              onBlur={formikProps.handleBlur}
                              value={
                                formikProps.values.subtasks[index].description
                              }
                            />
                            {formikProps.errors.subtasks &&
                              formikProps.errors.subtasks[index] &&
                              formikProps.errors.subtasks[index].description &&
                              formikProps.touched.subtasks &&
                              formikProps.touched.subtasks[index] &&
                              formikProps.touched.subtasks[index]
                                .description && (
                                <div className="text-red-600 text-sm mt-1">
                                  {
                                    formikProps.errors.subtasks[index]
                                      .description
                                  }
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

                          <div className="flex justify-end w-full">
                            <div
                              className="bg-red-600 hover:bg-red-400 duration-500 transition-all ease-in-out flex items-center text-white text-center  justify-center py-2 px-8 gap-3 rounded-md hover:scale-100 cursor-pointer"
                              onClick={() => remove(index)}
                            >
                              <button
                                type="button"
                                className="flex justify-center items-center text-center  "
                              >
                                <IoTrashBin size={20} className=" " />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        className="border p-2 w-full mt-2 flex items-center gap-3 justify-center"
                        type="button"
                        onClick={() =>
                          push({
                            title: '',
                            description: '',
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
