import { postAPI } from '../../services/fetchAPI'
import Button from '../Buttons/Button'

const SubtaskComponent = ({
  role,
  subtask,
  setSubtasks,
  setRefreshPage,
  refreshPage,
}) => {
  const today = new Date()
  //subtaskimizin durumunu değiştirmek için kullandığımız fonksiyonumuz
  const handleStatusToggle = async (subtaskId, currentStatus) => {
    const newStatus = !currentStatus
    const data = { subtaskId, status: newStatus }
    try {
      const res = await postAPI('/tasks/subtask/update-subtask-status', data)

      if (res.status === 'success') {
        setSubtasks((prevSubtasks) =>
          prevSubtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, status: newStatus }
              : subtask
          )
        )
        setRefreshPage(!refreshPage)
      } else {
        console.error('Failed to update subtask status')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const isTodayOrLater = (dateString) => {
    const subtaskDate = new Date(dateString)
    const currentDate = new Date(today)

    // Sadece tarih kısmını karşılaştır
    return (
      subtaskDate.getFullYear() > currentDate.getFullYear() ||
      (subtaskDate.getFullYear() === currentDate.getFullYear() &&
        subtaskDate.getMonth() > currentDate.getMonth()) ||
      (subtaskDate.getFullYear() === currentDate.getFullYear() &&
        subtaskDate.getMonth() === currentDate.getMonth() &&
        subtaskDate.getDate() >= currentDate.getDate())
    )
  }

  return (
    <div>
      {role === 'USER' && isTodayOrLater(subtask.createdAt) && (
        <Button
          key={subtask.id}
          title={
            subtask.status ? 'Alt başlık tamamlanmadı' : 'Alt başlık tamamlandı'
          }
          className={`mt-3 bg-gray-200 p-2 px-4 rounded-lg font-semibold text-sm text-gray-600 hover:text-white transition-all ease-in-out duration-500 transform ${
            subtask.status ? 'hover:bg-red-400 ' : 'hover:bg-green-400'
          }`}
          onClick={() => handleStatusToggle(subtask.id, subtask.status)}
        />
      )}
    </div>
  )
}

export default SubtaskComponent
