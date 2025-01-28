/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from 'react'
import { Book, Headphones, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {}

const InfoBar = (props: Props) => {
  return (
    <div className="flex flex-row justify-between items-center px-4 py-4 w-full dark:bg-black">
      <div className="flex items-center gap-2 font-bold">
      </div>
      
      <div className="absolute left-1/2 transform -translate-x-1/2">
      <a href="/">
        <Image
          src="/logo.jpeg" // Replace with your logo path
          alt="Company Logo"
          width={210} // Adjust as needed
          height={40} // Adjust as needed
        />
        </a>
      </div>
      
      <div className="flex items-center gap-6">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <Headphones />
            </TooltipTrigger>
            <TooltipContent>
              <p>Contact Support</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <Book />
            </TooltipTrigger>
            <TooltipContent>
              <p>Guide</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default InfoBar