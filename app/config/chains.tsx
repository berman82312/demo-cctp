import { baseSepolia, sepolia, type Chain } from "viem/chains";

type PublicPath = string;

type ChainConfig = {
    id: string,
    name: string,
    chainId: Chain['id'],
    cctpId: number,
    icon: PublicPath,
    isTestnet: boolean
}

export const Sepolia: ChainConfig = {
    id: 'sepolia',
    name: 'Sepolia',
    chainId: sepolia.id,
    cctpId: 0,
    icon: '/icons/sepolia.svg',
    isTestnet: true
}

export const BaseSepolia: ChainConfig = {
    id: 'base_sepolia',
    name: 'Base Sepolia',
    chainId: baseSepolia.id,
    cctpId: 6,
    icon: '/icons/base-sepolia.svg',
    isTestnet: true
}