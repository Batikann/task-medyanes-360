'use client'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import commentSchemaValidation from './commentSchemaValidation'
import { checkboxValues } from '../../../../lib/constants/commentFormValues.js'
import getUser from '../../../../lib/utils/getUser'
import { postAPI } from '../../../../services/fetchAPI'
import { useRouter } from 'next/navigation'
import { useRef } from 'react' // useRef ekledik

const CommentForm = ({ taskID }) => {
  const user = getUser()
  const router = useRouter()
  const formRef = useRef(null) // useRef ile form referansı oluşturduk

  const formHandler = async (values, { setSubmitting }) => {
    const newVal = { ...values, taskId: taskID, userId: user.id }
    const res = await postAPI('/comment/add-comment', newVal)
    if (res.status === 'success') {
      router.refresh()
      formRef.current.resetForm() // Formu sıfırladık
    }
    setSubmitting(false) // setSubmitting'i false yapmayı unutmayın
  }

  return (
    <div>
      <h1 className="text-xl font-bold border-b pb-2 uppercase">
        Submit a Comment
      </h1>
      <Formik
        innerRef={formRef} // ref'i Formik bileşenine ekledik
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
              <label className="text-lg font-semibold">Status</label>
              <div
                role="group"
                aria-labelledby="status"
                className="flex flex-wrap gap-4"
              >
                {checkboxValues.map((val) => (
                  <label key={val.id}>
                    <Field type="radio" name="status" value={val.name} />
                    {val.name}
                  </label>
                ))}
              </div>
              <ErrorMessage name="status" component="div" />
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold" htmlFor="content">
                Content
              </label>
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
              className="flex items-center justify-center bg-blue-600 text-white p-3 text-lg font-semibold rounded-lg hover:bg-blue-500 cursor-pointer"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
export default CommentForm
