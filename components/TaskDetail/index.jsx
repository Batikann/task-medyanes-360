'use client'

import checkPriority from '../../lib/utils/checkPriority'
import { formatDate } from '../../lib/utils/formatter'
import Button from '../Buttons/Button'
import { useEffect, useState } from 'react'
import Tab from '../Tab'
import { priorityLocalization } from '../../lib/utils/localizationText'
import SubtaskButton from '../SubtaskButton'
import { FaPlus } from 'react-icons/fa'
import SubtaskAddModal from '../../components/SubtaskAddModal'
import { postAPI } from '../../services/fetchAPI'
import UpdateDialog from '../../components/SubtaskUpdateModal/index'

const taskStatusLocalization = (status) => {
  switch (status) {
    case 'COMPLETED_CHECK_PENDING':
      return (
        <p>
          <span className="mr-2 font-bold">Durum:</span>Proje bitti kontrol
          bekliyor
        </p>
      )
    case 'IN_PROGRESS':
      return (
        <p>
          <span className="mr-2 font-bold">Durum:</span>Çalışma devam ediyor
        </p>
      )
    case 'UPDATE_PENDING':
      return (
        <p>
          <span className="mr-2 font-bold">Durum:</span>Güncelleme için bilgi
          bekliyor
        </p>
      )
    case 'INFO_REQUEST_PENDING':
      return (
        <p>
          <span className="font-bold mr-2">Durum:</span>Eksik bilgi olabilir
          bilgi bekliyor
        </p>
      )
    case 'CUSTOMER_WAITING':
      return (
        <p>
          <span className="font-bold mr-2">Durum:</span>Müşteri kontrolü
          bekliyor
        </p>
      )
    default:
      return 'Bilinmeyen durum'
  }
}

const TaskDetail = ({
  taskDetail,
  setPage,
  page,
  setRefreshPage,
  refreshPage,
  role,
  userId,
  updateTaskHandler,
  deleteTaskHandler,
}) => {
  const [subtasks, setSubtasks] = useState(taskDetail.subtasks)

  const [open, setOpen] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleOpenUpdate = (id) => {
    setSelectedId(id)
    setOpenUpdate(true)
  }

  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  //Kullanıcı tarafında göstermek için tamamlanan ve tüm subtasklerin sayısını aldığımız yer
  const completedSubtasks = subtasks.filter((subtask) => subtask.status).length
  const totalSubtasks = subtasks.length

  const deleteSubtaskHandle = async (id) => {
    const query = { id: id }
    const res = await postAPI('/tasks/subtask/delete-subtask', query)
    if (res.status === 'success') {
      setRefreshPage(!refreshPage)
      setSubtasks(taskDetail.subtasks)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Tab page={page} setPage={setPage} />
      <div className="border-b flex flex-col gap-4 pb-4">
        <div className="flex md:items-center flex-col md:flex-row gap-4 md:justify-between">
          <div className="flex md:items-center gap-4 flex-col md:flex-row items-start">
            <h1 className="text-4xl font-bold mt-4">{taskDetail.title}</h1>
            <p
              className={`${checkPriority(
                taskDetail.priority
              )}  p-2 px-4 text-sm rounded-full font-bold  `}
            >
              {priorityLocalization(taskDetail.priority)} <span>ÖNCELİK</span>
            </p>
          </div>
          {/* Kullanıcının role değeri admin ise bu alana erişebilir */}
          {role === 'ADMIN' && (
            <div className="flex gap-4">
              <Button
                title={'Güncelle'}
                className={
                  'bg-blue-500 text-white p-2 px-4 text-sm rounded-lg hover:bg-blue-400 font-semibold transition-all ease-in-out duration-500 transform'
                }
                onClick={updateTaskHandler}
              />

              <Button
                title={'Sil'}
                className={
                  'bg-red-500 text-white p-2 px-4 text-sm rounded-lg hover:bg-red-400 font-semibold transition-all ease-in-out duration-500 transform'
                }
                onClick={deleteTaskHandler}
              />
            </div>
          )}
        </div>
        <div className="flex md:flex-row flex-col md:items-center gap-4 ">
          <p>
            <span className="mr-2 font-bold">Oluşturma Tarihi :</span>{' '}
            {formatDate(taskDetail.createdAt)}
          </p>
          <p>{taskStatusLocalization(taskDetail.status)}</p>
        </div>
        <p className="text-lg">{taskDetail.description}</p>
      </div>
      <div className="flex flex-col gap-4 border-b pb-4">
        <h2 className="uppercase text-2xl font-semibold">Takım</h2>
        <div className="flex flex-col gap-3">
          {taskDetail.assignedUsers.map((teamMember) => (
            <div className="flex items-center gap-3" key={teamMember.user.id}>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex justify-center items-center">
                <span className="text-white font-bold uppercase">
                  {teamMember.user.name.slice(0, 1)}
                </span>
              </div>
              <div>
                <p>{teamMember.user.name}</p>
                <p className="text-sm text-gray-500">{teamMember.user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b-2 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold uppercase">Görevler</h2>
            <span className="text-xl font-bold">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div>
            <button
              onClick={handleOpen}
              className="flex flex-row-reverse items-center gap-3 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-400 duration-500 transition-all ease-in-out"
            >
              <FaPlus />
              <span className="font-bold text-sm ">Görev Ekle</span>
            </button>

            <SubtaskAddModal
              open={open}
              handleClose={handleClose}
              minDate={taskDetail.createdAt}
              taskId={taskDetail.id}
              userId={userId}
              setRefreshPage={setRefreshPage}
              refreshPage={refreshPage}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {taskDetail.subtasks.map((subtask) => (
            <div className="border-b pb-4 flex mb-4 justify-between">
              <div
                key={subtask.id}
                className="flex flex-col gap-2 items-start "
              >
                <div className="flex items-center gap-4">
                  <p className="flex gap-2 text-base">
                    <span className="font-bold ">Son Tarih:</span>{' '}
                    {formatDate(subtask.createdAt)}
                  </p>
                  <p
                    className={` p-1 px-2 text-sm font-semibold text-white rounded-lg ${
                      subtask.status ? 'bg-green-400' : 'bg-orange-300'
                    }`}
                  >
                    {subtask.status ? 'Bitti' : 'Devam Etmekte'}
                  </p>
                </div>
                <p>{subtask.title}</p>
                <p className="flex gap-2 text-base">
                  <span className="font-bold ">Görevi Oluşturan:</span>
                  {subtask.user.name}
                </p>

                <SubtaskButton
                  role={role}
                  subtask={subtask}
                  setSubtasks={setSubtasks}
                  setRefreshPage={setRefreshPage}
                  refreshPage={refreshPage}
                />
              </div>
              {subtask.userId === userId && (
                <div className="space-x-4">
                  <button
                    onClick={() => deleteSubtaskHandle(subtask.id)}
                    className="bg-red-600 hover:bg-red-400 cursor-pointer duration-500 ease-in-out transition-all px-4 rounded-md text-white py-2 font-semibold text-sm"
                  >
                    Sil
                  </button>
                  <button
                    onClick={() => handleOpenUpdate(subtask.id)}
                    className="bg-blue-600 hover:bg-blue-400 cursor-pointer duration-500 ease-in-out transition-all font-semibold text-sm px-4 rounded-md text-white py-2"
                  >
                    Güncelle
                  </button>
                </div>
              )}
            </div>
          ))}

          <UpdateDialog
            open={openUpdate}
            handleClose={handleCloseUpdate}
            id={selectedId}
            minDate={taskDetail.createdAt}
            refreshPage={refreshPage}
            setRefreshPage={setRefreshPage}
          />
        </div>
      </div>
    </div>
  )
}
export default TaskDetail
