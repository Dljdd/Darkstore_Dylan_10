/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from 'react'
import { LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Props = {}

const InfoBar = (props: Props) => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth)
      
      // Clear session cookie through API
      await fetch('/api/auth/logout', {
        method: 'POST',
      })

      // Hard redirect to landing page
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="flex flex-row justify-between items-center px-4 py-4 w-full dark:bg-black">
      <div className="flex items-center gap-2 font-bold">
      </div>
      
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <a href="/">
          <Image
            src="/logo1.png"
            alt="Company Logo"
            width={350}
            height={350}
          />
        </a>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors rounded-none"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default InfoBar