import * as Yup from 'yup'

const CommentSchema = Yup.object().shape({
  content: Yup.string()
    .min(2, 'Too Short!')
    .max(500, 'Too Long!')
    .required('Content required'),
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
