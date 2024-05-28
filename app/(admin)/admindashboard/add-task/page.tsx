'use client'

import { Formik, FieldArray, Form, Field } from 'formik'
import { useEffect, useState } from 'react'
import { addTaskValidationSchemma } from './addTaskValidationSchema.jsx'
import { getAPI, postAPI } from '../../../../services/fetchAPI'
import { getDateNow } from '../../../../lib/utils/dateUtils.js'
import TextInput from '../../../../components/Inputs/TextInput.jsx'
import SelectInput from '../../../../components/Inputs/SelectInput.jsx'
import DateInput from '../../../../components/Inputs/DateInput.jsx'
import { useRouter } from 'next/navigation'
import Loading from '../../../../components/loading/index.jsx'
import TrashIcon from '/public/trash.svg'
import Image from 'next/image'

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
  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        priority: 'LOW',
        createdAt: '',
        status: 'IN_PROGRESS',
        assignedUsers: [],
        subtasks: [],
      }}
      validationSchema={addTaskValidationSchemma}
      onSubmit={async (values, { setSubmitting }) => {
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
      }}
    >
      {(formikProps) => {
        const minSubtaskDate = formikProps.values.createdAt || minDate
        return (
          <Form className="flex flex-col gap-5 max-w-xl mx-auto">
            <TextInput label="Company Name" name="title" type="text" required />
            {formikProps.errors.title && formikProps.touched.title && (
              <div className="text-red-600 text-sm mt-1">
                {formikProps.errors.title}
              </div>
            )}
            <TextInput label="Description" name="description" as="textarea" />
            <SelectInput
              label="Priority"
              name="priority"
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
              ]}
            />
            <DateInput label="Created At" name="createdAt" min={minDate} />
            <SelectInput
              label="Status"
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
            <div>
              <label>Assigned Users</label>
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
            <div className="flex flex-col gap-2">
              <label>Subtasks</label>
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
                        </div>
                        <DateInput
                          label="Subtask Created At"
                          name={`subtasks[${index}].createdAt`}
                          min={minSubtaskDate}
                        />
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
                        push({
                          title: '',
                          createdAt: '',
                          status: false,
                        })
                      }
                    >
                      Add Subtask
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
            <button
              className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-500 font-semibold"
              type="submit"
            >
              Add Task
            </button>
          </Form>
        )
      }}
    </Formik>
  )
}
export default AddTaskPage
