'use client'

import { ErrorMessage, Field, Form, Formik, useField } from 'formik'
import commentSchemaValidation from './commentSchemaValidation'
import { checkboxValues } from '../../lib/constants/commentFormValues'
import { postAPI } from '../../services/fetchAPI'
import { useEffect, useRef } from 'react'
import { commentStatusLocalization } from '../../lib/utils/localizationText'
import { useSession } from 'next-auth/react'

const CommentForm = ({
  taskID,
  setRefreshPage,
  refreshPage,
  editComment,
  setEditComment,
}) => {
  const { data: session, status } = useSession()
  const formRef = useRef(null) // useRef ile form referansı oluşturduk

  useEffect(() => {
    if (editComment && formRef.current) {
      formRef.current.setValues({
        content: editComment.content,
        status: editComment.status,
      })
    }
  }, [editComment])

  //ekleme veya güncelleme işlemini yapan fonksiyon
  const formHandler = async (values, { setSubmitting }) => {
    const newVal = { ...values, taskId: taskID, userId: session?.user.id }

    let res
    if (editComment) {
      res = await postAPI(`/comment/${editComment.id}/update-comment`, newVal)
    } else {
      res = await postAPI('/comment/add-comment', newVal)
    }

    if (res.status === 'success') {
      setRefreshPage(!refreshPage)
      formRef.current.resetForm()
      setEditComment(null)
    }
    setSubmitting(false)
  }

  return (
    <div>
      <h1 className="text-xl font-bold border-b pb-2 uppercase text-[#01204E]">
        {editComment ? 'Yorum Güncelle' : 'Yorum Ekle'}
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
              {editComment ? 'Ekle' : 'Ekle'}
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
