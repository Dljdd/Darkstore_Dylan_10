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
    <nav className="bg-background h-screen overflow-scroll flex items-center flex-col justify-between gap-10 py-6 px-2 border-r border-border">
      <div className="flex items-center justify-center flex-col gap-8">
        <Link
          className="flex font-bold flex-row text-foreground hover:text-muted-foreground transition-colors"
          href="/"
        >
          SAAS
        </Link>
        <Separator className="bg-border" />
        <div className="flex items-center justify-center flex-col gap-4">
          {menuOptions.map((menuItem) => {
            const isActive = pathName === menuItem.href
            return (
              <TooltipProvider key={menuItem.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        "p-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                      )}
                    >
                      <menuItem.Component className="h-6 w-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{menuItem.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>
      <div className="flex items-center justify-center flex-col gap-4">
        <ModeToggle />
      </div>
    </nav>
  )
}

export default MenuOptions
