import { keccak256, pad } from 'viem'
import { type Address, type Hash, type Hex, type Abi } from '@/types/models'
import abi from '@/abi/TokenMessenger.json'
import messageTransmitterAbi from '@/abi/MessageTransmitter.json'
import { ChainConfig } from '../app/config/chains'
import BaseContract from './BaseContract'

type MessageSentEvent = {
    message: Hex
}

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

    async parseMessageHash(txHash: Hash) {
        const receipt = await this.waitForReceipt(txHash)

        const logs = this.parseReceiptLogs(receipt, 'MessageSent', messageTransmitterAbi as Abi)

        if (logs.length < 1) {
            throw new Error('No MessageSent event')
        }

        const args = logs[0].args as MessageSentEvent
        const messageBytes = args.message

        return keccak256(messageBytes)
    }
}