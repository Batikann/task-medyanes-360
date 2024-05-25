const checkPriority = (priority) => {
  switch (priority) {
    case 'LOW':
      return ' bg-green-500 '
    case 'MEDIUM':
      return ' bg-orange-600 '
    case 'HIGH':
      return ' bg-red-600 '
    default:
      return ''
  }
}

export default checkPriority
