'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Activity, Scale, Headphones, GraduationCap, DollarSign, Home, Menu, X } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Medical', href: '/medical', icon: Activity },
    { name: 'Legal', href: '/legal', icon: Scale },
    { name: 'Support', href: '/support', icon: Headphones },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'Financial', href: '/financial', icon: DollarSign },
  ]

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-emerald-500/10 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition-all"></div>
              <div className="relative w-12 h-12 bg-[#0F2D27] rounded-xl flex items-center justify-center p-2 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
                <Image 
                  src="/logo.png" 
                  alt="ASI-Agents Logo" 
                  width={48} 
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ASI-Agents
              </span>
              <span className="text-xs text-gray-400">Powered by ETHMem</span>
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
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-[#0F2D27]/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg opacity-20 blur"></div>
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#0F2D27]/50 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 px-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-[#0F2D27]/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
