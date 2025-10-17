import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// Create wagmi config
const metadata = {
  name: 'zKMem',
  description: 'Unified LLM Memory with Blockchain Identity',
  url: 'https://zkmem.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create wagmi config
export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, sepolia, hardhat],
  projectId,
  metadata,
  ssr: true
})

// Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - defaults to false
})
