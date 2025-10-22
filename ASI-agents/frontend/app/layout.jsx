import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ASI-Agents Dashboard',
  description: 'Multi-Domain AI Agent Ecosystems',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0f0f1e] to-[#14142d] animated-bg">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          
          {/* Ambient background effects */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
        </div>
      </body>
    </html>
  )
}
