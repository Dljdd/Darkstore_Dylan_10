/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import {DM_Sans} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Script from "next/script";

const font = DM_Sans({subsets: ['latin']})

export const metadata: Metadata = {
  title: "Darkstore",
  description: "Automates your workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return ( 
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <UserProvider>
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </UserProvider>
    </html>
  );
}
