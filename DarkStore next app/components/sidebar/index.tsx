/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { menuOptions } from "@/lib/constant"
import clsx from "clsx"
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from "../global/mode-toggle"
import { motion } from "framer-motion"

type Props = {}

const MenuOptions = (props: Props) => {
  const pathName = usePathname()

  return (
    <nav className="bg-gray-900 h-screen overflow-scroll flex items-center flex-col justify-between gap-10 py-6 px-2">
      <div className="flex items-center justify-center flex-col gap-8">
        <Link
          className="flex font-bold flex-row text-gray-100 hover:text-gray-300 transition-colors"
          href="/"
        >
          {/* Your logo or brand */}
        </Link>
        <TooltipProvider>
          {menuOptions.map((menuItem) => (
            <motion.ul key={menuItem.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        'group h-12 w-12 flex items-center justify-center rounded-lg p-2 cursor-pointer transition-all duration-300 ease-in-out',
                        {
                          'bg-gray-800 shadow-lg': pathName === menuItem.href,
                          'hover:bg-gray-800': pathName !== menuItem.href,
                        }
                      )}
                    >
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <menuItem.Component
                          selected={pathName === menuItem.href}
                          className={clsx(
                            'text-gray-400 transition-colors duration-300',
                            {
                              'text-gray-100': pathName === menuItem.href,
                            }
                          )}
                        />
                      </motion.div>
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-gray-800 text-gray-100 border border-gray-700"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </motion.ul>
          ))}
        </TooltipProvider>
        <Separator className="bg-gray-700" />
      </div>
      <div className="flex items-center justify-center flex-col gap-8">
        <ModeToggle />
      </div>
    </nav>
  )
}

export default MenuOptions
