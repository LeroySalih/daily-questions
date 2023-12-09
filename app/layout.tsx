import { GeistSans } from 'geist/font/sans'
import './globals.css'
import SignInOut from './components/signin-out'
import Link from 'next/link';
import Urls from './components/app-urls';




const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <meta charSet="utf-8"></meta>
      </head>
      <body className={`bg-background text-foreground`}>
        <main className="min-h-screen flex flex-col items-center">
         <Link href={Urls.home}>Home</Link><div><SignInOut/></div>
          {children}
        </main>
      </body>
    </html>
  )
}
