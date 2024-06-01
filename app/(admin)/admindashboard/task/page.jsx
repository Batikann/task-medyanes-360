'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAPI } from '../../../../services/fetchAPI/index.js'
import TaskList from '../../../../components/TaskList/index.jsx'
import { normalizeInput } from '../../../../lib/utils/formatter.js'
import SearchBar from '../../../../components/Searchbar'

const TasksPage = () => {
  const [tasks, setTasks] = useState([]) // Task verilerini tutar
  const [loading, setLoading] = useState(true) // Yüklenme durumunu tutar

  const [inputValue, setInputValue] = useState('') // Arama giriş değerini tutar

  const router = useRouter() // Router nesnesi
  const searchParams = useSearchParams() // URL parametrelerini alır

  useEffect(() => {
    const getTasks = async () => {
      const taskParam = searchParams.get('task')?.toUpperCase() || 'ALL' // task parametresini alır, yoksa 'ALL' kullanır
      const queryParam = searchParams.get('query') || '' // query parametresini alır, yoksa boş string kullanır
      setLoading(true)

      const taskData = await getAPI(`/tasks/${taskParam}/get-tasks`) // API'den task verilerini çeker
      const allTasks = taskData.data.tasks // Gelen verilerden task listesini alır

      const filteredTasks = queryParam
        ? allTasks.filter(
            (task) =>
              normalizeInput(task?.title)
                .toLowerCase()
                .includes(queryParam.toLowerCase()) || // Başlıkta arama yapar
              task.assignedUsers.some(
                (user) =>
                  normalizeInput(user.user?.username)
                    .toLowerCase()
                    .includes(queryParam.toLowerCase()) // Kullanıcı adında arama yapar
              )
          )
        : allTasks // Filtrelenmiş task listesini oluşturur

      setTasks(filteredTasks) // Task listesini günceller
      setLoading(false) // Yüklenme durumunu false yapar
    }
    getTasks() // Taskları alır
  }, [searchParams]) // searchParams değiştikçe çalışır

  useEffect(() => {
    const handleURLUpdate = () => {
      const taskParam = searchParams.get('task') || 'ALL' // task parametresini alır, yoksa 'ALL' kullanır
      const normalizedQuery = normalizeInput(inputValue) // Giriş değerini normalize eder
      if (normalizedQuery) {
        router.push(
          `/admindashboard/task?task=${taskParam}&query=${normalizedQuery}`,
          undefined,
          { shallow: true }
        ) // URL'yi query ile günceller
      } else {
        router.push(`/admindashboard/task?task=${taskParam}`, undefined, {
          shallow: true,
        }) // URL'yi query olmadan günceller
      }
    }

    const timer = setTimeout(handleURLUpdate, 500) // 500ms sonra URL'yi günceller

    return () => clearTimeout(timer) // Temizleme fonksiyonu
  }, [inputValue, router, searchParams]) // inputValue, router veya searchParams değiştikçe çalışır

  // Eğer Veritabanında hiç task yoksa kullanıcıyı bu konuda bilgilendiririz.
  if (tasks.length <= 0 && !loading) {
    return (
      <div className="flex flex-col gap-5">
        <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
        <p>No valid task found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
      {/* TaskList bileşenini render ediyoruz */}
      <TaskList tasks={tasks} loading={loading} />
    </div>
  )
}

export default TasksPage
