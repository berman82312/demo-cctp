import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia, baseSepolia } from '@reown/appkit/networks'
import { type CaipNetwork } from '@reown/appkit'
import { arbitrumSepolia } from '@wagmi/core/chains'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const arbitrumSepoliaCaip: CaipNetwork = {
  id: 'eip155:421614',
  chainId: 421614,
  chainNamespace: 'eip155',
  name: arbitrumSepolia.name,
  currency: arbitrumSepolia.nativeCurrency.symbol,
  explorerUrl: arbitrumSepolia.blockExplorers.default.url,
  rpcUrl: arbitrumSepolia.rpcUrls.default.http[0],
  imageUrl: '/icons/arbitrum-sepolia.svg'
}

export const networks = [sepolia, baseSepolia, arbitrumSepoliaCaip]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig