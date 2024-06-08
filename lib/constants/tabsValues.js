export const adminTaskTabValues = [
  {
    id: '1',
    name: 'Tüm Görevler',
    route: 'ALL',
  },
  {
    id: '2',
    name: 'Devam Eden Görevler',
    route: 'IN_PROGRESS',
  },

  {
    id: '3',
    name: 'Güncelleme Bekleyen Görevler',
    route: 'UPDATE_PENDING',
  },
  {
    id: '4',
    name: 'Bilgi Talebi Beklenen Görevler',
    route: 'INFO_REQUEST_PENDING',
  },
  {
    id: '5',
    name: 'Müşteri Beklenen Görevler',
    route: 'CUSTOMER_WAITING',
  },
  {
    id: '6',
    name: 'Tamamlanan Görevler',
    route: 'COMPLETED_CHECK_PENDING',
  },
]

export const priorityTabForUser = [
  {
    id: '1',
    name: 'Düşük Öncelik',
    priority: 'LOW',
    color: '#799351',
  },
  {
    id: '2',
    name: 'Orta Öncelik',
    priority: 'MEDIUM',
    color: '#FF9A00',
  },
  {
    id: '3',
    name: 'Yüksek Öncelik',
    priority: 'HIGH',
    color: '#FF0000',
  },
]
