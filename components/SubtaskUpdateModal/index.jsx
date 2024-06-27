import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { getAPI, postAPI } from '../../services/fetchAPI/index.js'
import { useEffect, useState } from 'react'

const UpdateDialog = ({
  open,
  handleClose,
  id,
  minDate,
  refreshPage,
  setRefreshPage,
}) => {
  const [title, setTitle] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [originalTitle, setOriginalTitle] = useState('')
  const [originalCreatedAt, setOriginalCreatedAt] = useState('')
  const minDateFormatter = new Date(minDate).toISOString().split('T')[0]

  useEffect(() => {
    const getSubtask = async (id) => {
      if (id) {
        const res = await getAPI(`/tasks/subtask/${id}/get-subtask`)
        if (res.status === 'success') {
          const task = res.task
          setTitle(task.title)
          setOriginalTitle(task.title)

          // Format createdAt to YYYY-MM-DD for date input
          const formattedDate = new Date(task.createdAt)
            .toISOString()
            .split('T')[0]
          setCreatedAt(formattedDate)
          setOriginalCreatedAt(formattedDate)
        }
      }
    }
    getSubtask(id)
  }, [id])

  const handleSave = async () => {
    const subtask = { id, title, createdAt }
    const res = await postAPI('/tasks/subtask/update-subtask', subtask)
    if (res.status === 'success') {
      setRefreshPage(!refreshPage)
    }
    handleClose()
  }

  const isSaveDisabled =
    title === originalTitle && createdAt === originalCreatedAt

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Görev Güncelle</DialogTitle>
      <DialogContent>
        <TextField
          id="title"
          autoFocus
          margin="dense"
          label="İçerik"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <Button onClick={handleClose}>İptal Et</Button>
        <Button onClick={handleSave} disabled={isSaveDisabled}>
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default UpdateDialog
