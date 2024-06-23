'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { MenuIcon, MessageCircleCode } from 'lucide-react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios, { AxiosError } from 'axios'
import { FaHamburger } from 'react-icons/fa'
import { useToast } from './ui/use-toast'

interface ApiResponse {
  success: boolean
  message: string
  data: string[]
}

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [usernames, setUsernames] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const handleMenuOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    if (usernames.length === 0 && !loading) {
      setLoading(true)
      try {
        const response = await axios.get<ApiResponse>("/api/fetch-usernames")
        if (response.data.success) {
          setUsernames(response.data.data)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch usernames"
          })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch users",
          variant: "destructive"
        })
      }
      setLoading(false)
    }
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <nav className='p-4 md:p-6 shadow-lg bg-black'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <div className='flex flex-initial gap-5 items-center justify-center'>
          <a className='text-2xl font-bold mb-4 md:mb-0 text-yellow-50 hover:text-green-300 delay-250 scale-150 animate-in' href="#">
            <MessageCircleCode />
          </a>
          <p className='text-3xl font-bold mb-4 md:mb-0 text-yellow-50 font-mono'>Send</p>
        </div>
        <div className='flex items-center'>
          {session ? (
            <>
              <Button className='w-full md:w-auto mr-2 text-yellow-50'  onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <Link href='/sign-in'>
              <Button className='w-full md:w-auto mr-2 text-yellow-50'>Login</Button>
            </Link>
          )}
          <Button onClick={handleMenuOpen} className='text-yellow-50 ml-2'>
            <MenuIcon />
            {usernames.length > 0 && (
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 shadow-md shadow-green-500/50 ml-2 animate-ping delay-1000" />
            )}
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {loading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              [
                <MenuItem key="header" disabled>
                  <h2 className='font-grey-400'>User accepting messages</h2>
                </MenuItem>,
                ...usernames.map((username, index) => (
                  <MenuItem key={index} onClick={handleMenuClose}>
                    <Link href={`/u/${username}`} passHref>
                      {username}
                    </Link>
                  </MenuItem>
                )),
              ]
            )}
          </Menu>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
