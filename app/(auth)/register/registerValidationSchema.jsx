import * as Yup from 'yup'

// Yup doğrulama şeması
export const registerValidationSchema = Yup.object({
  username: Yup.string()
    .min(5, 'Kullanıcı adı en az 5 karakter olmak zorundadır!')
    .required('Lütfen kullanıcı adı alanını doldurunuz!'),
  email: Yup.string()
    .email('Geçerli bir e-posta adresi giriniz!')
    .required('Lütfen e-posta adresi alanını doldurunuz!'),
  password: Yup.string()
    .min(8, 'Şifre en az 8 karakter olmalı!')
    .required('Lütfen şifre alanını doldurunuz!'),
})
