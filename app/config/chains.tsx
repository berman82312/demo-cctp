import { baseSepolia, sepolia, type Chain } from "viem/chains";
import { type Address } from '@/app/types/models'

type PublicPath = string;

export type ChainConfig = {
    id: string,
    name: string,
    chainId: Chain['id'],
    cctpId: number,
    icon: PublicPath,
    isTestnet: boolean,
    usdc: Address,
    tokenMessenger: Address,
    messageTransmitter: Address
}

export const Sepolia: ChainConfig = {
    id: 'sepolia',
    name: 'Sepolia',
    chainId: sepolia.id,
    cctpId: 0,
    icon: '/icons/sepolia.svg',
    isTestnet: true,
    usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    tokenMessenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    messageTransmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD'
}

export const BaseSepolia: ChainConfig = {
    id: 'base_sepolia',
    name: 'Base Sepolia',
    chainId: baseSepolia.id,
    cctpId: 6,
    icon: '/icons/base-sepolia.svg',
    isTestnet: true,
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    tokenMessenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    messageTransmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD'
}

export const AllChains = [
    Sepolia,
    BaseSepolia
]