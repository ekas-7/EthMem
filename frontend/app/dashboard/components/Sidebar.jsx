'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useWallet } from '../../../hooks/useWallet'
import { copyToClipboard, requestClipboardPermissions } from '../../../lib/clipboard'
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Puzzle, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Wallet,
  Database,
  Copy,
  Check
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3
  },
  {
    name: 'Integrations',
    href: '/dashboard/integrations',
    icon: Puzzle
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { 
    isConnected, 
    isConnecting, 
    connectWallet, 
    connectMetaMask,
    disconnectWallet, 
    connectors, 
    formattedAddress,
    address,
    balance,
    isSepolia,
    chainId,
    connectError,
    getMetaMaskConnector
  } = useWallet()

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleConnect = () => {
    if (isConnected) {
      disconnectWallet()
    } else {
      // Try to connect to MetaMask specifically
      const metaMaskConnector = getMetaMaskConnector()
      if (metaMaskConnector) {
        console.log('Connecting to MetaMask...')
        connectMetaMask()
      } else {
        console.log('MetaMask not found, using first available connector')
        const connector = connectors?.[0]
        if (connector) {
          connectWallet(connector)
        } else {
          console.error('No wallet connectors available')
        }
      }
    }
  }

  const handleLogout = () => {
    if (isConnected) {
      disconnectWallet()
    }
    // Add additional logout logic here (clear local storage, etc.)
    console.log('Logging out...')
  }

  const handleCopyAddress = async () => {
    if (!address) return
    
    try {
      // Try to request permissions first if needed
      await requestClipboardPermissions()
      
      const success = await copyToClipboard(address)
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        console.warn('Failed to copy address to clipboard')
      }
    } catch (error) {
      console.error('Error copying address:', error)
    }
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-lg">E</span>
        </div>
        <span className="text-2xl font-bold text-emerald-300">EthMem</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-emerald-700/20 text-emerald-300 border-r-2 border-emerald-400'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-4">
        {/* Connection Status */}
        <div className="space-y-2">
          {connectError && (
            <div className="p-2 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-xs">
              <strong>Connection Error:</strong> {connectError.message}
            </div>
          )}
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              isConnected
                ? 'bg-emerald-400 text-black hover:bg-emerald-500'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Wallet className="w-4 h-4" />
            <span>
              {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Wallet'}
            </span>
          </button>
          
          {isConnected && (
            <div className="text-xs text-gray-400 text-center space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <span>{formattedAddress}</span>
                <button
                  onClick={handleCopyAddress}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <div>{balance}</div>
              <div className={`px-2 py-1 rounded text-xs ${
                isSepolia 
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-red-900/30 text-red-400'
              }`}>
                {isSepolia ? 'Sepolia' : `Chain ${chainId}`}
              </div>
            </div>
          )}
        </div>

        {/* Support & Logout */}
        <div className="space-y-2">
          <Link
            href="/support"
            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-gray-900 min-h-screen p-6 flex-col border-r border-gray-800">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed left-0 top-0 w-72 bg-gray-900 min-h-screen p-6 flex flex-col z-40 transform transition-transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>
    </>
  )
}
