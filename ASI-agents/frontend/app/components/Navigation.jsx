'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Scale, Headphones, GraduationCap, DollarSign, Home, Sparkles } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Medical', href: '/medical', icon: Activity },
    { name: 'Legal', href: '/legal', icon: Scale },
    { name: 'Support', href: '/support', icon: Headphones },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'Financial', href: '/financial', icon: DollarSign },
  ]

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur group-hover:blur-md transition-all"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ASI-Agents
              </span>
              <span className="text-xs text-gray-400">Powered by zkMem</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg opacity-20 blur"></div>
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
