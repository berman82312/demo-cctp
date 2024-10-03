import { type Hash } from '@/types/models'

export function maskedHash(hash: Hash) {
    return `${hash.slice(0, 4)}...${hash.slice(-4)}`
}