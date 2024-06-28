import { calculateDuration } from './dateUtils'

export const filteredTaskFunc = (
  conditions,
  tasks,
  setFilteredTasks,
  sortDirection
) => {
  let sortedTasks = [...tasks] // Clone the tasks array

  switch (conditions) {
    case 'priority':
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      sortedTasks.sort((a, b) =>
        sortDirection === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority]
      )
      break
    case 'createdAt':
      sortedTasks.sort((a, b) =>
        sortDirection === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      )
      break
    case 'subtasks':
      sortedTasks.sort((a, b) =>
        sortDirection === 'asc'
          ? a.subtasks.length - b.subtasks.length
          : b.subtasks.length - a.subtasks.length
      )
      break
    case 'comments':
      sortedTasks.sort((a, b) =>
        sortDirection === 'asc'
          ? a.comments.length - b.comments.length
          : b.comments.length - a.comments.length
      )
      break
    case 'title':
      sortedTasks.sort((a, b) => {
        const titleA = a.title.toUpperCase() // ignore upper and lowercase
        const titleB = b.title.toUpperCase() // ignore upper and lowercase
        if (sortDirection === 'asc') {
          if (titleA > titleB) return -1
          if (titleA < titleB) return 1
        } else {
          if (titleA < titleB) return -1
          if (titleA > titleB) return 1
        }
        return 0 // titles are equal
      })
      break
    case 'elapsedTime':
      sortedTasks.sort((a, b) =>
        sortDirection === 'asc'
          ? calculateDuration(a.createdAt) - calculateDuration(b.createdAt)
          : calculateDuration(b.createdAt) - calculateDuration(a.createdAt)
      )
      break
    default:
      return sortedTasks // Default case, no sorting
  }

  setFilteredTasks(sortedTasks)
}
