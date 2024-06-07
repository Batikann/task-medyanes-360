'use client'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import commentSchemaValidation from './commentSchemaValidation'
import { checkboxValues } from '../../lib/constants/commentFormValues'
import getUser from '../../lib/utils/getUser'
import { postAPI } from '../../services/fetchAPI'
import { useEffect, useRef } from 'react'
import { commentStatusLocalization } from '../../lib/utils/localizationText'

const CommentForm = ({
  taskID,
  setRefreshPage,
  refreshPage,
  editComment,
  setEditComment,
}) => {
  const user = getUser()

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
    const newVal = { ...values, taskId: taskID, userId: user.id }

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
      <h1 className="text-xl font-bold border-b pb-2 uppercase">
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
              <label className="text-lg font-semibold">Durum</label>
              <div
                role="group"
                aria-labelledby="status"
                className="flex flex-wrap gap-4"
              >
                {checkboxValues.map((val) => (
                  <label key={val.id}>
                    <Field type="radio" name="status" value={val.name} />
                    {commentStatusLocalization(val.name)}
                  </label>
                ))}
              </div>
              <ErrorMessage name="status" component="div" />
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold" htmlFor="content">
                İçerik
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
              className="flex items-center justify-center bg-blue-600 text-white p-3 text-lg font-semibold rounded-lg hover:bg-blue-500 cursor-pointer transition-all ease-in-out duration-500 transform"
            >
              {editComment ? 'Güncelle' : 'Ekle'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
export default CommentForm
