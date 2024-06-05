import * as Yup from 'yup'

const CommentSchema = Yup.object().shape({
  content: Yup.string()
    .min(2, 'Çok Kısa')
    .max(500, 'Çok Uzun')
    .required('İçerik Alanı Gerekli'),
  status: Yup.string()
    .oneOf([
      'STARTED',
      'COMPLETED',
      'IN_PROGRESS',
      'COMMENTED',
      'BUG',
      'ASSIGNED',
    ])
    .required('Required'),
})

export default CommentSchema
