import abi from '@/abi/MessageTransmitter.json'
import { type ChainConfig } from "@/app/config/chains";
import { type Hex, type Abi, type Hash } from '@/types/models'
import BaseContract from "./BaseContract";

type MessageSentEvent = {
    message: Hex
}

export class MessageTransmitter extends BaseContract {
    static fromChainConfig(chain: ChainConfig) {
        return new MessageTransmitter(abi as Abi, chain.messageTransmitter)
    }

    async receive(messageBytes: string, signature: string) {
        return await this.write('receiveMessage', [messageBytes, signature])
    }

    async parseMessageBytes(txHash: Hash) {
        const receipt = await this.waitForReceipt(txHash)

        const logs = this.parseReceiptLogs(receipt, 'MessageSent')

        if (logs.length < 1) {
            throw new Error('No MessageSent event')
        }

        const args = logs[0].args as MessageSentEvent
        const messageBytes = args.message
        
        return messageBytes
    }
}