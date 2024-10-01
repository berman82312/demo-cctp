type PublicPath = string;

type ChainConfig = {
    id: string,
    name: string,
    cctpId: number,
    icon: PublicPath,
    isTestnet: boolean
}

export const Sepolia: ChainConfig = {
    id: 'sepolia',
    name: 'Sepolia',
    cctpId: 0,
    icon: '/icons/sepolia.svg',
    isTestnet: true
}

export const BaseSepolia: ChainConfig = {
    id: 'base_sepolia',
    name: 'Base Sepolia',
    cctpId: 6,
    icon: '/icons/base-sepolia.svg',
    isTestnet: true
}