import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// Warn if project ID is not configured
if (projectId === 'YOUR_PROJECT_ID') {
  console.warn('⚠️ WalletConnect Project ID not configured. Please set NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID in your environment variables.')
  console.warn('Get your Project ID from: https://cloud.reown.com')
  console.warn('This may cause wallet connection issues.')
}

// Create wagmi config
const metadata = {
  name: 'ETHMem',
  description: 'Unified LLM Memory with Blockchain Identity',
  url: 'https://ethmem.vercel.app/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create wagmi config
export const wagmiConfig = defaultWagmiConfig({
  chains: [sepolia, mainnet, hardhat], // Sepolia first for default
  projectId,
  metadata,
  ssr: true,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true
})

// Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: false, // Disable analytics to reduce external requests
  enableOnramp: false, // Disable onramp to reduce external requests
  themeMode: 'dark', // Match your app's dark theme
  themeVariables: {
    '--w3m-font-family': 'var(--font-geist-sans)', // Use your app's font
  }
})
