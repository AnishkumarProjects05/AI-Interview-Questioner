"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'

function Login() {
  const signInGoogle = async () =>{
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if(error){
      console.log('Error: ', error.message)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen border rounded-lg gap-10 p-10 shadow-lg">
      <div className='flex flex-col items-center justify-center'>
        <Image src="/logo.png" alt="logo" width={230} height={230} className='w-[180px]'/>
      </div>
      <div className='flex items-center flex-col gap-4 '>
        <Image src={'/login.png'} alt='login' width={100} height={320} className='w-[400px] h-[200px]'/>
        <h2 className='text-2xl font-bold text-center'>Welcome to CareerConnect AI</h2>
        <p className='text-center'>Sign in through Google Securely</p>
        <Button className='mt-7'
        onClick={signInGoogle}>Sign in with Google</Button>
      </div>

    </div>
  )
}

export default Login
