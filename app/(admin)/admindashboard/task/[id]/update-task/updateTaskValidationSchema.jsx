import * as Yup from 'yup'

export const updateTaskValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  priority: Yup.mixed()
    .oneOf(['LOW', 'MEDIUM', 'HIGH'])
    .required('Priority is required'),
  createdAt: Yup.date().required('Created date is required'),
  status: Yup.mixed()
    .oneOf([
      'COMPLETED_CHECK_PENDING',
      'IN_PROGRESS',
      'UPDATE_PENDING',
      'INFO_REQUEST_PENDING',
      'CUSTOMER_WAITING',
    ])
    .required('Status is required'),
  assignedUsers: Yup.array().of(Yup.string()),
  subtasks: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Subtask title is required'),
      status: Yup.boolean(),
    })
  ),
})
