'use client'

import { Formik, FieldArray, Form, Field } from 'formik'
import TextInput from '../Inputs/TextInput.jsx'
import SelectInput from '../Inputs/SelectInput.jsx'
import DateInput from '../Inputs/DateInput.jsx'
import TrashIcon from '/public/trash.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Loading from '../loading/index.jsx'
import { getDateNow } from '../../lib/utils/dateUtils.js'
import { getAPI } from '../../services/fetchAPI/index.js'

const TaskForm = ({ task = null, validationSchema, onSubmit }) => {
  const [users, setUsers] = useState([{ id: '', username: '' }])
  const [minDate, setMinDate] = useState('')
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
          <Form className="flex flex-col gap-5 max-w-xl mx-auto">
            <TextInput label="Başlık" name="title" type="text" required />
            {formikProps.errors.title && formikProps.touched.title && (
              <div className="text-red-600 text-sm mt-1">
                {formikProps.errors.title}
              </div>
            )}
            <TextInput label="Açıklama" name="description" as="textarea" />
            {formikProps.errors.description &&
              formikProps.touched.description && (
                <div className="text-red-600 text-sm mt-1">
                  {formikProps.errors.description}
                </div>
              )}
            <SelectInput
              label="Öncelik"
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
              label="Oluşturma Tarihi"
              name="createdAt"
              min={minCreatedAtDate}
            />
            {formikProps.errors.createdAt && formikProps.touched.createdAt && (
              <div className="text-red-600 text-sm mt-1">
                {formikProps.errors.createdAt}
              </div>
            )}
            <SelectInput
              label="Durum"
              name="status"
              options={[
                {
                  value: 'COMPLETED_CHECK_PENDING',
                  label: 'Completed Check Pending',
                },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'UPDATE_PENDING', label: 'Update Pending' },
                {
                  value: 'INFO_REQUEST_PENDING',
                  label: 'Info Request Pending',
                },
                { value: 'CUSTOMER_WAITING', label: 'Customer Waiting' },
              ]}
            />
            {formikProps.errors.status && formikProps.touched.status && (
              <div className="text-red-600 text-sm mt-1">
                {formikProps.errors.status}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <label>Atanan Kullanıcılar</label>
              <div className="flex flex-col gap-2">
                {users.map((user) => (
                  <div key={user.id}>
                    <Field
                      id={`assignedUsers-${user.id}`}
                      name={`assignedUsers`}
                      type="checkbox"
                      value={user.id}
                      className="mr-2"
                    />
                    <label htmlFor={`assignedUsers-${user.id}`}>
                      {user.username}
                    </label>
                  </div>
                ))}
              </div>
              {formikProps.errors.assignedUsers &&
                formikProps.touched.assignedUsers && (
                  <div className="text-red-600 text-sm mt-1">
                    {formikProps.errors.assignedUsers}
                  </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
              <label>Alt Başlıklar</label>
              <FieldArray name="subtasks">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-3">
                    {formikProps.values.subtasks.map((subtask, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="flex-1">
                          <TextInput
                            label="Subtask Title"
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
                          label="Subtask Created At"
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
                        <div className="flex justify-center items-center ">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="flex justify-center items-center text-center"
                          >
                            <Image
                              src={TrashIcon}
                              width={20}
                              height={20}
                              alt="trash-icon"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="border p-2 w-full mt-2"
                      type="button"
                      onClick={() =>
                        push({ title: '', createdAt: '', status: false })
                      }
                    >
                      Alt Başlık Ekle
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
            <button
              className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-500 font-semibold transition-all ease-in-out duration-500 transform"
              type="submit"
            >
              {initialValues.id ? 'Görev Güncelle' : 'Görev Ekle'}
            </button>
          </Form>
        )
      }}
    </Formik>
  )
}

export default TaskForm
