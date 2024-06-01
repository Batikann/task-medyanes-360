'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { normalizeInput } from '../../lib/utils/formatter'

const Dropdown = ({ selectedStatus, setSelectedStatus, taskStatus }) => {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  // Dropdown değiştiğinde çalışacak fonksiyon
  const handleChange = (event) => {
    const selectedId = event.target.value
    const selectedTask = taskStatus.find((task) => task.id === selectedId)
    setSelectedStatus(selectedTask.name)
  }

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <div>
      <select
        className="py-4 px-6 text-sm font-semibold"
        onChange={handleChange}
      >
        {taskStatus.map((task) => (
          <option
            onClick={() =>
              router.push(
                pathName +
                  '?' +
                  createQueryString('taskStatus', normalizeInput(task.name))
              )
            }
            key={task.id}
            value={task.id}
          >
            {task.name}
          </option>
        ))}
      </select>
    </div>
  )
}
export default Dropdown
