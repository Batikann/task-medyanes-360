'use client'

import { Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { loginValidationSchema } from './loginValidationSchema'

import Input from '../_components/Input'
import Button from '../_components/Button'
import Link from 'next/link'
import { useNotification } from '../../../context/NotificationContext '

const LoginPage = () => {
  const [error, setError] = useState('')
  const router = useRouter()
  const { showNotification } = useNotification()

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Giriş Yap</h2>
      <Formik
        validateOnMount={true}
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const result = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
          })

          if (result?.ok) {
            setTimeout(() => {
              router.push(`/userdashboard`)
            }, 3000)
          } else {
            setError(result?.error || 'Giriş işlemi başarısız oldu.')
          }
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Şifre
                </label>
              </div>
              <div className="mt-2">
                <Input name={'password'} type={'password'} props={props} />
                {props.errors.password && props.touched.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {props.errors.password}
                  </div>
                )}
              </div>
            </div>
            {/* Bir hata varsa kullancıya hata mesajı gösterilir.   */}
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

            <div className="mt-6">
              <Button props={props} title={'Giriş Yap'} />
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-4">
        <Link
          href={'/register'}
          className="text-blue-400 text-base hover:underline-offset-2 hover:underline transition-all ease-in-out duration-500 transform"
        >
          Buradan Kaydolun!
        </Link>
      </div>
    </>
  )
}

export default LoginPage
