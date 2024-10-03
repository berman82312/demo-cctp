import { type Address, type Hash, type Hex } from '@/types/models'
import { type ChainConfig } from "../app/config/chains";
import { ERC20 } from "./ERC20";
import { TokenMessenger } from "./TokenMessenger";
import { switchChain } from '@wagmi/core';
import { config } from '../app/config/WagmiConfig';
import { AttestationService } from './AttestationService';
import { keccak256 } from 'viem';
import { MessageTransmitter } from './MessageTransmitter';

export class CCTP {
    tokenMessenger: TokenMessenger
    attestation: AttestationService
    messageTransmitter: MessageTransmitter
    source: ChainConfig
    destination: ChainConfig
    
    constructor(fromChain: ChainConfig, toChain: ChainConfig) {
        this.tokenMessenger = TokenMessenger.fromChainConfig(fromChain)
        this.attestation = new AttestationService()
        this.source = fromChain
        this.destination = toChain
        this.messageTransmitter = MessageTransmitter.fromChainConfig(toChain)
    }

    async checkChain(chain: ChainConfig) {
        await switchChain(config, {
            chainId: chain.chainId
        })
    }

    async transfer(token: Address, amount: bigint, fromAddress: Address, toAddress: Address) {
        await this.checkChain(this.source)

        const tokenContract = new ERC20(token)
        await tokenContract.approveCheck(fromAddress, this.tokenMessenger.address, amount)

        const txHash = await this.tokenMessenger.depositForBurn(token, amount, this.destination, toAddress)
        return txHash
    }

    async parseMessageBytes(txHash: Hash) {
        await this.checkChain(this.source)
        const messageTransmitter = MessageTransmitter.fromChainConfig(this.source)
        const messageBytes = await messageTransmitter.parseMessageBytes(txHash)
        return messageBytes
    }

    async getSignature(messageBytes: Hex) {
        // 0x30b0bd802e9b7ccede41fb4ad45b7b9aca08dc1d4181204e412d08f2cf2bc39250995d334dcd0fbbec28e242c626ac257e8999de88cf81fe353ed41062b286821c60b30c2e5e77becee6100af13cd2ed427f3fb13f448b6c8b4826dad6ffec6947221f38f06677ab77c7bc90524c0829a02fabf4c29baa3a0f78633e287ced24581c
        const messageHash = keccak256(messageBytes)
        const signature = await this.attestation.getSignature(messageHash)
        return signature
    }

    async receive(messageBytes: Hex, signature: string) {
        await this.checkChain(this.destination)
        const txHash = await this.messageTransmitter.receive(messageBytes, signature)
        
        return txHash
    }

    // function receive({chain, messageBytes, signature}) {}
}