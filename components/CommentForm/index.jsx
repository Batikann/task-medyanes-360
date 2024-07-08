'use client'

import { ErrorMessage, Field, Form, Formik, useField } from 'formik'
import commentSchemaValidation from './commentSchemaValidation'
import { checkboxValues } from '../../lib/constants/commentFormValues'
import { getAPI, postAPI } from '../../services/fetchAPI'
import { useEffect, useRef, useState } from 'react'
import { commentStatusLocalization } from '../../lib/utils/localizationText'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material'

const CommentForm = ({ taskID, setRefreshPage, refreshPage }) => {
  const { data: session, status } = useSession()
  const formRef = useRef(null)
  const [subtasks, setSubtasks] = useState([])
  const [selectedSubtask, setSelectedSubtask] = useState('')

  const formHandler = async (values, { setSubmitting }) => {
    const newVal = {
      ...values,
      taskId: taskID,
      userId: session?.user.id,
      subtaskId: selectedSubtask,
    }

    const res = await postAPI('/comment/add-comment', newVal)

    if (res.status === 'success') {
      toast.success('Yorumunuz başarıyla eklendi!')
      setRefreshPage(!refreshPage)
      formRef.current.resetForm()
      setSelectedSubtask('')
    }
    setSubmitting(false)
  }

  useEffect(() => {
    const getSubtaskOnlyTrue = async () => {
      const res2 = await getAPI(`/tasks/${taskID}/get-subtasks`)
      if (res2.status === 'success') {
        setSubtasks(res2.task.subtasks)
      }
    }
    getSubtaskOnlyTrue()
  }, [taskID])

  return (
    <div>
      <h1 className="text-xl font-bold border-b pb-2 uppercase text-[#01204E]">
        Yorum Ekle
      </h1>
      <Formik
        innerRef={formRef}
        initialValues={{
          content: '',
          status: 'STARTED',
        }}
        validationSchema={commentSchemaValidation}
        onSubmit={formHandler}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 mt-4">
              <div
                role="group"
                aria-labelledby="status"
                className="flex flex-wrap gap-4"
              >
                {checkboxValues.map((val) => (
                  <RadioButtonWithLabel
                    key={val.id}
                    name="status"
                    value={val.name}
                    label={commentStatusLocalization(val.name)}
                  />
                ))}
              </div>
              <ErrorMessage name="status" component="div" />
            </div>

            <div className="my-4">
              <FormControl fullWidth>
                <InputLabel id="subtask-select-label">Alt Görev Seç</InputLabel>
                <Select
                  labelId="subtask-select-label"
                  id="subtask-select"
                  value={selectedSubtask}
                  label="Alt Görev Seç"
                  onChange={(e) => setSelectedSubtask(e.target.value)}
                >
                  {subtasks.map((subtask) => (
                    <MenuItem key={subtask.id} value={subtask.id}>
                      {subtask.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex flex-col gap-4">
              <Field
                as="textarea"
                name="content"
                style={{
                  height: '200px',
                  padding: '10px',
                  border: '1px solid #808080',
                }}
              />
              <ErrorMessage
                name="content"
                component="div"
                style={{ color: 'red' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center bg-blue-600 text-white p-3 text-lg font-semibold rounded-lg hover:bg-blue-500 cursor-pointer transition-all ease-in-out duration-500 transform"
            >
              Ekle
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CommentForm

const RadioButtonWithLabel = ({ name, value, label }) => {
  const [field] = useField({ name, type: 'radio', value })
  const isSelected = field.checked

  return (
    <label className="flex gap-2">
      <Field type="radio" name={name} value={value} />
      <p className={`${isSelected ? 'text-blue-700' : 'text-black'}`}>
        {label}
      </p>
    </label>
  )
}
