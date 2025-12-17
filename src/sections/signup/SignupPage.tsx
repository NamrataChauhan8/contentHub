'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

type FormValues = {
  name: string
  email: string
  password: string
  confirm: string
}

export default function SignupPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirm: '' }
  })

  const password = watch('password', '')

  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const passwordStrength = (pw = '') => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }
  const strength = passwordStrength(password)

  async function onSubmit(values: FormValues) {
    if (values.password !== values.confirm) {
      setError('confirm', {
        type: 'manual',
        message: 'Passwords do not match'
      })
      return
    } else {
      clearErrors('confirm')
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password
        })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const message = (data && data.message) || `Signup failed (${res.status})`
        setError('email', { type: 'server', message })
        return
      }

      router.push('/api/auth/signin?callbackUrl=/dashboard')
    } catch (err) {
      setError('email', {
        type: 'server',
        message: 'Network error. Please try again.'
      })
    }
  }

  const inputBase =
    'w-full rounded-lg px-3 py-2 transition-shadow bg-white/80 dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-400'
  const errorClass = 'border-red-300'

  return (
    <div className='px-4 sm:px-0 mb-10'>
      <div className='max-w-md mx-auto mt-10 p-6 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold'>Create your account</h1>
          <p className='text-sm text-gray-500'>Join us — it takes less than a minute.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4' noValidate>
          <div className='text-sm'>
            <span className='mb-1 block font-medium text-gray-400'>Name</span>
            <input
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 1, message: 'Name is required' }
              })}
              className={`${inputBase} ${errors.name ? errorClass : 'border-transparent shadow-sm'}`}
              placeholder='Your full name'
              aria-invalid={!!errors.name}
            />
            {errors.name && <span className='mt-1 text-xs text-red-600'>{errors.name.message}</span>}
          </div>

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
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className='mt-1 text-xs text-red-600'>{errors.email.message}</span>}
          </div>

          <div className='text-sm relative'>
            <div className='flex items-baseline justify-between mb-1'>
              <span className='font-medium text-gray-400'>Password</span>

              <button
                type='button'
                onClick={e => {
                  e.stopPropagation()
                  setShowPass(prev => !prev)
                }}
                className='text-xs underline'
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            <input
              type={showPass ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              className={`${inputBase} ${errors.password ? errorClass : 'border-transparent shadow-sm'}`}
              placeholder='At least 8 characters'
              aria-invalid={!!errors.password}
            />

            <div className='mt-2'>
              <div className='h-2 w-full rounded overflow-hidden bg-gray-200 dark:bg-gray-700'>
                <div
                  className={`h-full transition-all duration-300 ${
                    strength === 0
                      ? 'w-0'
                      : strength === 1
                        ? 'w-1/4'
                        : strength === 2
                          ? 'w-1/2'
                          : strength === 3
                            ? 'w-3/4'
                            : 'w-full'
                  } bg-gradient-to-r from-amber-400 to-green-500`}
                />
              </div>

              <div className='mt-1 text-xs text-gray-500'>
                {password.length === 0
                  ? 'Use at least 8 characters — mix letters, numbers & symbols'
                  : strength <= 1
                    ? 'Weak'
                    : strength === 2
                      ? 'Fair'
                      : strength === 3
                        ? 'Good'
                        : 'Strong'}
              </div>

              {errors.password && <span className='mt-1 text-xs text-red-600'>{errors.password.message}</span>}
            </div>
          </div>

          <div className='text-sm relative'>
            <div className='flex items-baseline justify-between mb-1'>
              <span className='mb-1 block font-medium text-gray-400'>Confirm Password</span>
              <button
                type='button'
                className='text-xs underline'
                onClick={e => {
                  e.stopPropagation()
                  setShowConfirm(prev => !prev)
                }}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showConfirm ? 'text' : 'password'}
              {...register('confirm', {
                required: 'Please confirm your password',
                validate: (val: string) => (val === password ? true : 'Passwords do not match')
              })}
              className={`${inputBase} ${errors.confirm ? errorClass : 'border-transparent shadow-sm'}`}
              placeholder='Re-enter your password'
              aria-invalid={!!errors.confirm}
            />
            {errors.confirm && <span className='mt-1 text-xs text-red-600'>{errors.confirm.message}</span>}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-2 px-4 font-medium shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition'
          >
            {isSubmitting ? (
              <svg className='animate-spin h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
              </svg>
            ) : (
              'Create account'
            )}
          </button>

          <p className='mt-4 text-sm text-gray-500'>
            Already have an account?
            <Link href='/api/auth/signin?callbackUrl=/dashboard' className='font-medium text-blue-500 hover:underline'>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
