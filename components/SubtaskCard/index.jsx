import { formatDate } from '../../lib/utils/formatter'
import SubtaskButton from '../SubtaskButton'
import { FaCheck, FaUser, FaCalendar } from 'react-icons/fa'
import { CgSandClock } from 'react-icons/cg'
import { Tooltip } from '@mui/material'
const SubtaskCard = ({
  subtask,
  role,
  setSubtasks,
  setRefreshPage,
  refreshPage,
  deleteSubtaskHandle,
  handleOpenUpdate,
  userId,
}) => {
  const isPastDueDate = new Date(subtask.createdAt) < new Date()

  return (
    <div className="border p-4 py-8 flex justify-between rounded-lg shadow-md">
      <div key={subtask.id} className="flex flex-col gap-2 items-start ">
        <div className="flex flex-col items-start gap-5">
          <p
            className={` py-[6px] px-2 text-sm font-semibold text-white rounded-lg ${
              subtask.status ? 'bg-green-400' : 'bg-orange-300'
            }`}
          >
            {subtask.status ? (
              <>
                <p className="flex items-center gap-3">
                  Tamamlandı <FaCheck />
                </p>
              </>
            ) : (
              <>
                <p className="flex gap-3 items-center">
                  Devam Etmekte <CgSandClock />
                </p>
              </>
            )}
          </p>
          <Tooltip
            title="Son Tarih"
            className="flex gap-3 text-sm font-semibold items-center"
            placement="top-start"
          >
            <FaCalendar size={18} className="text-gray-500" />
            {formatDate(subtask.createdAt)}
          </Tooltip>
        </div>
        <p className="text-lg  mt-2">{subtask.title}</p>
        <Tooltip
          title="Görevi Oluşturan"
          placement="bottom"
          className="text-base flex gap-3 items-center  mt-1"
        >
          <FaUser className="text-blue-500" size={18} />
          {subtask.user.name}
        </Tooltip>

        <SubtaskButton
          role={role}
          subtask={subtask}
          setSubtasks={setSubtasks}
          setRefreshPage={setRefreshPage}
          refreshPage={refreshPage}
        />
      </div>
      {subtask.userId === userId && !isPastDueDate && (
        <div className=" flex xl:flex-row items-start gap-3 md:flex-col">
          <button
            onClick={() => handleOpenUpdate(subtask.id)}
            className="bg-blue-600 hover:bg-blue-400 cursor-pointer duration-500 ease-in-out transition-all font-semibold text-sm px-4 rounded-md text-white py-2"
          >
            Güncelle
          </button>
          <button
            onClick={() => deleteSubtaskHandle(subtask.id)}
            className="bg-red-600 hover:bg-red-400 cursor-pointer duration-500 ease-in-out transition-all px-4 rounded-md text-white py-2 font-semibold text-sm"
          >
            Sil
          </button>
        </div>
      )}
    </div>
  )
}
export default SubtaskCard
