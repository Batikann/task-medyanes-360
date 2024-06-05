export const formatDate = (isoString) => {
  // ISO 8601 tarihini Date nesnesine dönüştür
  const date = new Date(isoString)

  // Aylar ve günler için sıfır eklemek için
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Aylar 0-11 arası olduğu için 1 eklenir
  const year = date.getFullYear()

  // İstediğiniz formatta birleştirme
  return `${day}-${month}-${year}`
}

export const normalizeInput = (input) => {
  const turkishCharMap = {
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
  }
  return input
    .split('')
    .map((char) => turkishCharMap[char] || char)
    .join('')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

export const priorityLocalization = (priority) => {
  switch (priority) {
    case 'LOW':
      return ' DÜŞÜK '
    case 'MEDIUM':
      return ' ORTA '
    case 'HIGH':
      return ' YÜKSEK '
    default:
      return ''
  }
}

export const commentStatusLocalization = (commentStatus) => {
  switch (commentStatus) {
    case 'STARTED':
      return 'BAŞLATILDI'
    case 'COMPLETED':
      return 'TAMAMLANDI'
    case 'IN_PROGRESS':
      return 'DEVAM ETMEKTE'
    case 'COMMENTED':
      return 'YORUM YAPILDI'
    case 'BUG':
      return 'BUG'
    case 'ASSIGNED':
      return 'ATANDI'
  }
}
