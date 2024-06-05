'use client'

import checkPriority from '../../lib/utils/checkPriority'
import { formatDate, priorityLocalization } from '../../lib/utils/formatter'
import Button from '../Buttons/Button'
import { useEffect, useState } from 'react'
import { postAPI } from '../../services/fetchAPI'
import Tab from '../Tab'

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
          bilgi
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
  updateTaskHandler,
  deleteTaskHandler,
}) => {
  const [subtasks, setSubtasks] = useState(taskDetail.subtasks)

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

  //Kullanıcının role alanı user mı ve subtask için son güncelleme tarihini geçip geçmediğimizi kontrol ettiğimiz alanımız
  useEffect(() => {
    const today = new Date()
    const showUpdateButton = subtasks.some(
      (subtask) => new Date(subtask.createdAt) > today && role === 'USER'
    )
    setUpdateButtonVisible(showUpdateButton)
  }, [subtasks, role])

  const [updateButtonVisible, setUpdateButtonVisible] = useState(false)

  //Kullanıcı tarafında göstermek için tamamlanan ve tüm subtasklerin sayısını aldığımız yer
  const completedSubtasks = subtasks.filter((subtask) => subtask.status).length
  const totalSubtasks = subtasks.length
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
              )} text-white p-2 px-4 text-sm rounded-full font-bold  `}
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
                  {teamMember.user.username.slice(0, 1)}
                </span>
              </div>
              <div>
                <p>{teamMember.user.username}</p>
                <p className="text-sm text-gray-500">{teamMember.user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold uppercase">Alt Başlıklar</h2>
          <span className="text-xl font-bold">
            {completedSubtasks}/{totalSubtasks}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {taskDetail.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex flex-col gap-2 items-start border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <p>Son Tarih: {formatDate(subtask.createdAt)}</p>
                <p
                  className={` p-1 px-2 text-sm font-semibold text-white rounded-lg ${
                    subtask.status ? 'bg-green-400' : 'bg-orange-300'
                  }`}
                >
                  {subtask.status ? 'Bitti' : 'Devam Etmekte'}
                </p>
              </div>
              <p>{subtask.title}</p>
              {/* Kullanıcının rolü 'USER' ise ve son tarih geçmediyse göster */}
              {updateButtonVisible && (
                <Button
                  title={
                    subtask.status
                      ? 'Alt başlık tamamlanmadı'
                      : 'Alt başlık tamamlandı'
                  }
                  className={`bg-gray-200 p-2 px-4 rounded-lg font-semibold text-sm text-gray-600  hover:text-white transition-all ease-in-out duration-500 transform ${
                    subtask.status ? 'hover:bg-red-400 ' : 'hover:bg-green-400'
                  }`}
                  onClick={() => handleStatusToggle(subtask.id, subtask.status)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default TaskDetail
