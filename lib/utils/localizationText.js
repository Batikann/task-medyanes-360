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

export const taskStatusLocalization = (status) => {
  switch (status) {
    case 'COMPLETED_CHECK_PENDING':
      return <p>Proje bitti kontrol bekliyor</p>
    case 'IN_PROGRESS':
      return <p>Çalışma devam ediyor</p>
    case 'UPDATE_PENDING':
      return <p>Güncelleme için bilgi bekliyor</p>
    case 'INFO_REQUEST_PENDING':
      return <p>Eksik bilgi olabilir bilgi</p>
    case 'CUSTOMER_WAITING':
      return <p>Müşteri kontrolü bekliyor</p>
    default:
      return 'Bilinmeyen durum'
  }
}
