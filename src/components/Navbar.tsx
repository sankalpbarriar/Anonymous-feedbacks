'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'  //ye wo session jo hamne manipulate kiya tha
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session } = useSession()   //useSession ek method hai isliye direct use nahi kar sakte

  const user: User = session?.user as User

  return (

    <nav className='p-4 md:p-6 shadow-lg bg-black'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a  className='text-xl font-bold mb-4 md:mb-0 text-yellow-50' href="#">Send Message</a>
        {
          session ? (
            <>
              <span className='mr-4'>WELCOME ,{user?.username} || user?.email</span>
              <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <Link href='/sign-in'>
              <Button className='w-full md:w-auto rounded-none bg-white text-black'>Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar