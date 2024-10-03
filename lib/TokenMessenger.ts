import { pad } from 'viem'
import { type Address, type Abi } from '@/types/models'
import abi from '@/abi/TokenMessenger.json'
import { ChainConfig } from '../app/config/chains'
import BaseContract from './BaseContract'

export class TokenMessenger extends BaseContract {

    static fromChainConfig(chain: ChainConfig) {
        return new TokenMessenger(abi as Abi, chain.tokenMessenger)
    }

    async depositForBurn(token: Address, amount: bigint, toChain: ChainConfig, toAddress: Address) {
        const txHash = await this.write('depositForBurn', [
            amount,
            toChain.cctpId,
            pad(toAddress),
            token
        ])

        return txHash
    }
}