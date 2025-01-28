import './globals.css'

export const metadata = {
  title: 'Darkstore Map',
  description: 'Darkstore locations map view',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
