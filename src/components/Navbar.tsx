'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'  //ye wo session jo hamne manipulate kiya tha
import { User } from 'next-auth'
import { Button } from './ui/button'
import { MessageCircle, MessageCircleCode, MessageCircleDashed, MessageCircleReply } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()   //useSession ek method hai isliye direct use nahi kar sakte

  const user: User = session?.user as User

  return (

    <nav className='p-4 md:p-6 shadow-lg bg-black '>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <div className='flex flex-initial gap-5 items-center justify-center'>
        <a  className='text-2xl font-bold mb-4 md:mb-0 text-yellow-50 hover:text-green-300 delay-25 0 scale-150 animate-in' href="#"><MessageCircleCode/></a>
        <p className='text-3xl font-bold mb-4 md:mb-0 text-yellow-50 font-mono'>Send</p>
        </div>
        {
          session ? (
            <>
              <span className='mr-4'>WELCOME ,{user?.username} || user?.email</span>
              <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <Link href='/sign-in'>
              <Button className='w-full md:w-auto'>Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar