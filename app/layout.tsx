import '../styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Cville Travel Companion',
  description: 'Chat with Sam Calagione – your beer-savvy Charlottesville travel guide',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
