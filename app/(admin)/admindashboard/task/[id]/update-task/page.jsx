'use client'

import { useEffect, useState } from 'react'
import { getAPI, postAPI } from '../../../../../../services/fetchAPI'
import { Formik, Form, FieldArray, Field } from 'formik'
import { useRouter } from 'next/navigation'
import TextInput from '../../../../../../components/Inputs/TextInput'
import SelectInput from '../../../../../../components/Inputs/SelectInput'
import DateInput from '../../../../../../components/Inputs/DateInput'
import Loading from '../../../../../../components/loading'
import TrashIcon from '/public/trash.svg'
import Image from 'next/image'

const UpdateTaskPage = ({ params }) => {
  const [task, setTask] = useState(null)
  const [users, setUsers] = useState([])

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
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formikProps) => {
        const minSubtaskDate = formikProps.values.createdAt || minDate
        return (
          <Form className="flex flex-col gap-5 max-w-xl mx-auto">
            <TextInput label="Title" name="title" type="text" required />
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
            <DateInput
              label="Created At"
              name="createdAt"
              value={formikProps.values.createdAt}
              readOnly={true}
            />
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
            <div className="flex flex-col gap-4">
              <label>Assigned Users</label>
              <div className="flex flex-col gap-2">
                {users.map((user) => (
                  <div key={user.id}>
                    <Field
                      id={`assignedUsers-${user.id}`}
                      name="assignedUsers"
                      type="checkbox"
                      value={user.id}
                      checked={formikProps.values.assignedUsers.includes(
                        user.id
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          formikProps.setFieldValue('assignedUsers', [
                            ...formikProps.values.assignedUsers,
                            user.id,
                          ])
                        } else {
                          formikProps.setFieldValue(
                            'assignedUsers',
                            formikProps.values.assignedUsers.filter(
                              (id) => id !== user.id
                            )
                          )
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`assignedUsers-${user.id}`}>
                      {user.username}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-col">
              <label>Subtasks</label>
              <div>
                <FieldArray name="subtasks">
                  {(arrayHelpers) => (
                    <div className="flex flex-col gap-3">
                      {formikProps.values.subtasks.map((subtask, index) => (
                        <div
                          key={index}
                          className="flex gap-4 w-full items-center "
                        >
                          <div className="flex-1">
                            <TextInput
                              label="Subtask Title"
                              name={`subtasks.${index}.title`}
                              defaultValue={subtask.title}
                            />
                          </div>
                          <DateInput
                            label="Subtask Created At"
                            name={`subtasks.${index}.createdAt`}
                            min={minSubtaskDate}
                            value={formikProps.values.subtasks[index].createdAt}
                            onChange={(e) =>
                              formikProps.setFieldValue(
                                `subtasks.${index}.createdAt`,
                                e.target.value
                              )
                            }
                          />
                          <div className="!flex !justify-center !items-center">
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                              className="!flex !items-center !justify-center w-full h-full"
                            >
                              <Image
                                src={TrashIcon}
                                width={20}
                                height={20}
                                alt="trash-icon"
                                className="hover:text-red-600"
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({ title: '', createdAt: '' })
                        }
                        className="border p-2 hover:bg-blue-300 hover:text-white"
                      >
                        Add Subtask
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:scale-95 hover:bg-blue-500"
            >
              Update Task
            </button>
          </Form>
        )
      }}
    </Formik>
  )
}

export default UpdateTaskPage
