'use client';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { MenuIcon, LogOut } from 'lucide-react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  
  const isMainPage = pathname !== '/' ;
  console.log(isMainPage);
  const logoSize : number = isMainPage ? 370 : 250;
  return (
    <header className={`fixed right-0 left-0 top-0 ${isMainPage ? 'py-4' : 'py-2'} px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center justify-between border-b-[1px] border-neutral-900`}>
      <aside className="flex items-center gap-[2px] mx-auto">
        <Image
          src="/logo1.png"
          width={logoSize}
          height={logoSize}
          alt="darkstore logo"
          className="shadow-sm"
        />
      </aside>
      <aside className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Dashboard
              </span>
            </Link>
            <Link href="/api/auth/logout">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Get Started
            </span>
          </Link>
        )}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  )
}

export default Navbar;