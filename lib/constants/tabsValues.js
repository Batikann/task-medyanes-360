export const adminTaskTabValues = [
  {
    id: '1',
    name: 'Tüm Projeler',
    route: 'ALL',
  },
  {
    id: '2',
    name: 'Devam Eden Projeler',
    route: 'IN_PROGRESS',
  },

  {
    id: '3',
    name: 'Güncelleme Bekleyen Projeler',
    route: 'UPDATE_PENDING',
  },
  {
    id: '4',
    name: 'Bilgi Talebi Beklenen Projeler',
    route: 'INFO_REQUEST_PENDING',
  },
  {
    id: '5',
    name: 'Müşteri Beklenen Projeler',
    route: 'CUSTOMER_WAITING',
  },
  {
    id: '6',
    name: 'Tamamlanan Projeler',
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

export const adminTableValues = [
  {
    id: '1',
    name: 'Proje İsmi',
    conditions: 'title',
  },
  {
    id: '2',
    name: 'Açıklama',
    conditions: null,
  },
  {
    id: '3',
    name: 'Öncelik Derecesi',
    conditions: 'priority',
  },
  {
    id: '4',
    name: ' Durumu',
    conditions: null,
  },
  {
    id: '5',
    name: 'Oluşturulma Tarihi',
    conditions: 'createdAt',
  },
  {
    id: '6',
    name: 'Geçen Süre',
    conditions: 'elapsedTime',
  },
  {
    id: '7',
    name: 'Personel',
    conditions: null,
  },
  {
    id: '8',
    name: 'Alt Başlık Sayısı',
    conditions: 'subtasks',
  },
  {
    id: '9',
    name: 'Yorum Sayısı',
    conditions: 'comments',
  },
  {
    id: '10',
    name: 'İşlemler',
    conditions: null,
  },
]
