import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { TiDelete } from 'react-icons/ti'

const DeleteModal = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="flex justify-center">
        <TiDelete className="text-red-600" size={65} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="text-black font-bold text-lg">
          Silmek istediğinize emin misiniz?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className="text-black font-semibold">
          Hayır
        </Button>
        <Button
          onClick={handleDelete}
          className="text-red-600 font-semibold"
          autoFocus
        >
          Evet
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default DeleteModal
