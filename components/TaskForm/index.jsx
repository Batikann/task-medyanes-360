import { Formik, FieldArray, Form, Field } from 'formik'
import TextInput from '../Inputs/TextInput.jsx'
import SelectInput from '../Inputs/SelectInput.jsx'
import DateInput from '../Inputs/DateInput.jsx'
import TrashIcon from '/public/trash.svg'
import Image from 'next/image'

const TaskForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  users,
  minDate,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => {
        const minSubtaskDate = formikProps.values.createdAt || minDate
        return (
          <Form className="flex flex-col gap-5 max-w-xl mx-auto">
            <TextInput label="Title" name="title" type="text" required />
            {formikProps.errors.title && formikProps.touched.title && (
              <div className="text-red-600 text-sm mt-1">
                {formikProps.errors.title}
              </div>
            )}
            <TextInput label="Description" name="description" as="textarea" />
            {formikProps.errors.description &&
              formikProps.touched.description && (
                <div className="text-red-600 text-sm mt-1">
                  {formikProps.errors.description}
                </div>
              )}
            <SelectInput
              label="Priority"
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
            <DateInput label="Created At" name="createdAt" min={minDate} />
            {formikProps.errors.createdAt && formikProps.touched.createdAt && (
              <div className="text-red-600 text-sm mt-1">
                {formikProps.errors.createdAt}
              </div>
            )}
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
            {formikProps.errors.status && formikProps.touched.status && (
              <div className="text-red-600 text-sm mt-1">
                {formikProps.errors.status}
              </div>
            )}
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
              {formikProps.errors.assignedUsers &&
                formikProps.touched.assignedUsers && (
                  <div className="text-red-600 text-sm mt-1">
                    {formikProps.errors.assignedUsers}
                  </div>
                )}
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
              {initialValues.id ? 'Update Task' : 'Add Task'}
            </button>
          </Form>
        )
      }}
    </Formik>
  )
}

export default TaskForm
