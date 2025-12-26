'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/providers/UserProvider'
import { FcGoogle } from 'react-icons/fc'
import Image from 'next/image'
import logo from '../../assets/images/contenthub.png'

type FormValues = {
  email: string
  password: string
}

const LoginPage = () => {
  const [showPass, setShowPass] = useState(false)

  const router = useRouter()
  const { refreshUser } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data: FormValues) => {
    clearErrors()

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    })

    if (res?.ok) {
      await refreshUser()
      router.push('/dashboard')
    }

    if (res?.error) {
      setError('password', {
        type: 'manual',
        message: 'Invalid email or password'
      })
      return
    }
  }

  const inputBase =
    'w-full rounded-lg px-3 py-2 transition-shadow bg-white/80 dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-400'
  const errorClass = 'border-red-300'

  return (
    <div className='px-4 sm:px-0 mb-10'>
      <div className='max-w-md mx-auto mt-10 p-6 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg'>
        <div className='mb-6 flex justify-center'>
          <Image src={logo} alt='Logo' width={120} height={80} />
        </div>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold'>Sign in to your account</h1>
          <p className='text-sm text-gray-500'>Welcome back</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4' noValidate>
          {/* Email */}
          <div className='text-sm'>
            <span className='mb-1 block font-medium text-gray-400'>Email</span>
            <input
              type='email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email'
                }
              })}
              className={`${inputBase} ${errors.email ? errorClass : 'border-transparent shadow-sm'}`}
              placeholder='you@company.com'
            />
            {errors.email && <span className='mt-1 text-xs text-red-600'>{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className='text-sm'>
            <div className='flex items-baseline justify-between mb-1'>
              <span className='font-medium text-gray-400'>Password</span>
              <button type='button' onClick={() => setShowPass(p => !p)} className='text-xs underline'>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            <input
              type={showPass ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required'
              })}
              className={`${inputBase} ${errors.password ? errorClass : 'border-transparent shadow-sm'}`}
              placeholder='Your password'
            />
            {errors.password && <span className='mt-1 text-xs text-red-600'>{errors.password.message}</span>}
          </div>

          {/* Credentials Login */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='mt-2 rounded-xl bg-blue-600 text-white py-2 font-medium shadow hover:bg-blue-700 disabled:opacity-60'
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Divider */}
          <div className='relative my-3'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t'></div>
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='bg-white dark:bg-gray-900 px-2 text-gray-400'>OR</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type='button'
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className='flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-2 px-4 font-medium shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:hover:bg-gray-800'
            aria-label='Continue with Google'
          >
            <FcGoogle className='text-xl' />
            <span>Continue with Google</span>
          </button>

          {/* Signup Link */}
          <p className='mt-4 text-sm text-gray-500 text-center'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' className='font-medium text-blue-500 hover:underline'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
