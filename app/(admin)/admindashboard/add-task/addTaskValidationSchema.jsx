import * as Yup from 'yup'

//Task Eklerkenki validasyon işlemleri için geçerli validasyon kurallarımız
export const addTaskValidationSchemma = Yup.object().shape({
  title: Yup.string().required('Başlık gereklidir'),
  description: Yup.string().required('Açıklama gereklidir'),
  priority: Yup.mixed()
    .oneOf(['LOW', 'MEDIUM', 'HIGH'])
    .required('Öncelik gereklidir'),
  createdAt: Yup.date().required('Oluşturulma tarihi gereklidir'),
  status: Yup.mixed()
    .oneOf([
      'COMPLETED_CHECK_PENDING',
      'IN_PROGRESS',
      'UPDATE_PENDING',
      'INFO_REQUEST_PENDING',
      'CUSTOMER_WAITING',
    ])
    .required('Durum gereklidir'),
  assignedUsers: Yup.array().of(Yup.string()),
  subtasks: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Alt görev başlığı gereklidir'),
      status: Yup.boolean(),
    })
  ),
})
