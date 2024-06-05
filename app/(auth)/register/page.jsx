'use client'

import { postAPI } from '../../../services/fetchAPI'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { registerValidationSchema } from './registerValidationSchema'
import { useState } from 'react'
import Input from '../_components/Input'
import Button from '../_components/Button'
import Link from 'next/link'

const RegisterPage = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Üye Ol</h2>
      <Formik
        validateOnMount={true}
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={registerValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            //Gelen kullanıcı bilgilerine göre kullanıcıyı veritabanına kaydet ve gelen response değeri başarılı ise login sayfasına yönlendir.
            const res = await postAPI('/auth/register', values)
            if (res.status == 'success') {
              setTimeout(() => {
                router.push('/login')
              }, 3000)
            } else {
              setErrorMessage(res.message)
            }
          } catch (error) {
            console.error('API request failed:', error)
          }
          setSubmitting(false)
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ad Soyad
              </label>
              <div className="mt-2">
                <Input type={'text'} name={'username'} props={props} />
                {props.errors.username && props.touched.username && (
                  <div className="text-red-600 text-sm mt-1">
                    {props.errors.username}
                  </div>
                )}
              </div>
            </div>
            <div className="my-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email Adresi
              </label>
              <div className="mt-2">
                <Input name={'email'} type={'email'} props={props} />
                {props.errors.email && props.touched.email && (
                  <div className="text-red-600 text-sm mt-1">
                    {props.errors.email}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mt-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Şifre
                </label>
                <Input type={'password'} name={'password'} props={props} />
                {props.errors.password && props.touched.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {props.errors.password}
                  </div>
                )}
              </div>
            </div>

            {/* Eğer bir hata mesajı varsa bunu kullanıcıya göster */}
            {errorMessage && (
              <p className="text-red-600 mt-4 text-center">{errorMessage}</p>
            )}
            <div className="mt-6">
              <Button title={'Üye Ol'} props={props} />
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-4">
        <Link
          href={'/login'}
          className="text-blue-400 text-base hover:underline-offset-2 hover:underline"
        >
          Buradan Giriş Yap!
        </Link>
      </div>
    </>
  )
}

export default RegisterPage
