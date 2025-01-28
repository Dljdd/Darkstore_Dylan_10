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
import { motion } from "framer-motion"

type Props = {}

const MenuOptions = (props: Props) => {
  const pathName = usePathname()

  return (
    <nav className="bg-background h-screen flex items-center justify-center w-20 border-r border-border">
      <div className="flex items-center justify-center flex-col gap-6">
        {menuOptions.map((menuItem) => {
          const isActive = pathName === menuItem.href
          return (
            <TooltipProvider key={menuItem.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={menuItem.href}
                    className={clsx(
                      "p-3 rounded-lg transition-colors flex items-center justify-center",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                    )}
                  >
                    <menuItem.Component className="h-6 w-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </nav>
  )
}

export default MenuOptions
