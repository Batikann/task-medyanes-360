import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '../../../lib/prisma/index'
import { postAPI } from '../../../services/fetchAPI/index'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials
        const res = await postAPI('/auth/login', { email, password })

        if (res.status === 'error') {
          throw new Error(res.message || 'Giriş işleminde bir hata oluştu.')
        }

        const { data, status } = res
        if (status === 'success') {
          return {
            name: data.name,
            email: data.email,
            role: data.role,
            id: data.id,
          }
        }
        throw new Error('Giriş işleminde bir hata oluştu.')
      },
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = token
      return session
    },
  },
  async redirect({ url, baseUrl }) {
    return url.startsWith(baseUrl) ? url : baseUrl
  },
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(authOptions)
