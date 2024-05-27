import * as Yup from 'yup'

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Geçerli bir e-posta adresi giriniz!')
    .required('Lütfen e-posta alanını doldurunuz!'),
  password: Yup.string().required('Lütfen şifre alanını doldurunuz!.'),
})
