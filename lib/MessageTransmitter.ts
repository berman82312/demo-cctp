import { keccak256 } from "viem";
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
}