import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { postAPI } from '../../services/fetchAPI'
import { toast } from 'react-toastify'

const SubtaskAddModal = ({
  open,
  handleClose,
  taskId,
  userId,
  setRefreshPage,
  refreshPage,
}) => {
  const [createdAt, setCreatedAt] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries(formData.entries())
    const title = formJson.title
    const subtask = { title, createdAt, taskId, userId }
    const res = await postAPI('/tasks/subtask/create-subtask', subtask)
    if (res.status === 'success') {
      toast.success('Görev Başarıyla Eklendi')
      setRefreshPage(!refreshPage)
    }
    handleClose()
  }

  // Get today's date in YYYY-MM-DD format
  const minDate = new Date()
  const minDateFormatter = minDate.toISOString().split('T')[0]

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Yeni Görev Ekle</DialogTitle>
      <DialogContent>
        <TextField
          id="title"
          name="title"
          label="İçerik"
          multiline
          type="text"
          margin="dense"
          variant="standard"
          autoFocus
          required
          fullWidth
        />
        <TextField
          id="date"
          name="date"
          label="Tarih Seç"
          type="date"
          margin="dense"
          variant="standard"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          inputProps={{
            min: minDateFormatter,
          }}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button
          className="!font-bold !text-red-600 hover:!text-red-400 !duration-500 !transition-all !ease-in-out"
          onClick={handleClose}
        >
          İptal Et
        </Button>
        <Button
          className="!font-bold !text-green-600 hover:!text-green-400 !duration-500 !transition-all !ease-in-out"
          type="submit"
        >
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubtaskAddModal
