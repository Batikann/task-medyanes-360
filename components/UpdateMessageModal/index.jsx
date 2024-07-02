import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
} from '@mui/material'
import { getAPI, postAPI } from '../../services/fetchAPI'
import { toast } from 'react-toastify'
import { commentStatusLocalization } from '../../lib/utils/localizationText'
import { checkboxValues } from '../../lib/constants/commentFormValues'
import { ErrorMessage, Field, Form, Formik } from 'formik'

const UpdateMessageModal = ({
  open,
  handleClose,
  commentID,
  setRefreshPage,
  refreshPage,
}) => {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('STARTED')
  const [originalContent, setOriginalContent] = useState('')
  const [originalStatus, setOriginalStatus] = useState('STARTED')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getComment = async (id) => {
      if (id) {
        const res = await getAPI(`/comment/${id}/get-comment`)
        console.log(res)
        if (res) {
          setContent(res.comment[0].content)
          setStatus(res.comment[0].status)
          setOriginalContent(res.comment[0].content)
          setOriginalStatus(res.comment[0].status)
          setIsLoading(false)
        }
      }
    }
    if (open) {
      setIsLoading(true)
      getComment(commentID)
    }
  }, [commentID, open])

  const handleSave = async (values) => {
    const updatedComment = {
      id: commentID,
      content: values.content,
      status: values.status,
    }
    const res = await postAPI(
      `/comment/${commentID}/update-comment`,
      updatedComment
    )
    if (res.status === 'success') {
      toast.success('Yorum başarıyla güncellendi')
      setRefreshPage(!refreshPage)
    }
    handleClose()
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Yorum Güncelle</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Formik
            initialValues={{ content, status }}
            enableReinitialize
            onSubmit={handleSave}
          >
            {({ values, handleChange }) => (
              <Form>
                <Field
                  as={TextField}
                  id="content"
                  name="content"
                  margin="dense"
                  label="İçerik"
                  type="text"
                  fullWidth
                  multiline
                  rows={4}
                  value={values.content}
                  onChange={handleChange}
                />
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">Durum</FormLabel>
                  <RadioGroup
                    aria-label="status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                  >
                    {checkboxValues.map((val) => (
                      <RadioButtonWithLabel
                        key={val.id}
                        name="status"
                        value={val.name}
                        label={commentStatusLocalization(val.name)}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                <DialogActions>
                  <Button onClick={handleClose}>İptal Et</Button>
                  <Button type="submit">Kaydet</Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UpdateMessageModal

const RadioButtonWithLabel = ({ name, value, label }) => (
  <FormControlLabel
    control={<Field as={Radio} type="radio" name={name} value={value} />}
    label={label}
  />
)
