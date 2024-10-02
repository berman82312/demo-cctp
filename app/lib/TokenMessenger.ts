import { keccak256, pad } from 'viem'
import { type Address, type Hash } from '@/app/types/models'
import abi from '@/app/abi/TokenMessenger.json'
import messageTransmitterAbi from '@/app/abi/MessageTransmitter.json'
import { ChainConfig } from '../config/chains'
import { type Abi } from '@/app/types/models'
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

        const messageHash = await this._parseMessageHash(txHash)

        return messageHash
    }

    async _parseMessageHash(txHash: Hash) {
        const receipt = await this.waitForReceipt(txHash)

        const logs = this.parseReceiptLogs(receipt, 'MessageSent', messageTransmitterAbi as Abi)

        if (logs.length < 1) {
            throw new Error('No MessageSent event')
        }

        const messageBytes = logs[0].args?.message

        return keccak256(messageBytes)
    }
}