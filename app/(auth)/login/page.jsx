'use client'

import { postAPI } from '../../../services/fetchAPI'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { loginValidationSchema } from './loginValidationSchema'
import { useRoleRedirect } from '../../../lib/utils/useRoleRedirect'
import Loading from '../../../components/loading'
import Input from '../_components/Input'
import Button from '../_components/Button'
import Link from 'next/link'

const LoginPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const loading = useRoleRedirect([''], '/userdashboard')

  //kullanıcı bilgisi yüklenene kadar kullanıcı gittiği sayfayı göremesin diye bir loading gösteriyoruz.
  if (loading) {
    return <Loading />
  }
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <Formik
        validateOnMount={true}
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            //kullanıcının göndermiş olduğu bilgilere göre veritabanına istek atıyoruz ve geri dönen responsa göre belirli işlemler yapıyoruz.
            const res = await postAPI('/auth/login', values)
            if (res && res.status == 'success') {
              const userData = {
                role: res.data.role,
                username: res.data.user.username,
                email: res.data.user.email,
                id: res.data.user.id,
              }

              // Kullanıcı verilerini localStorage'e kaydettik ve rolüne göre gerekli dashboard sayfasına yönlendirdik.
              localStorage.setItem('currentUser', JSON.stringify(userData))
              if (res.data.role === 'USER') {
                setTimeout(() => {
                  router.push('/userdashboard')
                }, 3000)
              } else if (res.data.role === 'ADMIN') {
                setTimeout(() => {
                  router.push('/admindashboard')
                }, 3000)
              }
            } else {
              // Giriş başarısız olduğunda kullanıcıya gösterilmek üzere hata mesajı kaydedilir.
              setError(res.message)
            }
          } catch (error) {
            console.error('API request failed:', error)
          }
          setSubmitting(false)
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <div className="my-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
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
                  Password
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
              <Button props={props} title={'Login'} />
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-4">
        <Link
          href={'/register'}
          className="text-blue-400 text-base hover:underline-offset-2 hover:underline"
        >
          Sign up Here!
        </Link>
      </div>
    </>
  )
}

export default LoginPage
