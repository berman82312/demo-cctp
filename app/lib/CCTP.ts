import { type Address } from '@/app/types/models'
import { type ChainConfig } from "../config/chains";
import { ERC20 } from "./ERC20";
import { TokenMessenger } from "./TokenMessenger";
import { switchChain } from '@wagmi/core';
import { config } from '../config/WagmiConfig';
import { AttestationService } from './AttestationService';

export class CCTP {
    async transfer(token: Address, amount: bigint, fromChain: ChainConfig, fromAddress: Address, toChain: ChainConfig, toAddress: Address) {
        // Check wallet is on the correct chain
        await switchChain(config, {
            chainId: fromChain.chainId
        })

        // Initialize services 
        const tokenMessenger = TokenMessenger.fromChainConfig(fromChain)
        const tokenContract = new ERC20(token)
        const attestation = new AttestationService()

        // Approve messenger contract to withdraw
        await tokenContract.approveCheck(fromAddress, tokenMessenger.address, amount)

        // Call depositForBurn
        const messageHash = await tokenMessenger.depositForBurn(token, amount, toChain, toAddress)
        console.log("Message hash: ", messageHash)

        // Fetch attestation signature
        const signature = await attestation.getSignature(messageHash)
        console.log(`Signature: ${signature}`)

        return signature
        // 0x30b0bd802e9b7ccede41fb4ad45b7b9aca08dc1d4181204e412d08f2cf2bc39250995d334dcd0fbbec28e242c626ac257e8999de88cf81fe353ed41062b286821c60b30c2e5e77becee6100af13cd2ed427f3fb13f448b6c8b4826dad6ffec6947221f38f06677ab77c7bc90524c0829a02fabf4c29baa3a0f78633e287ced24581c
    }

    // function receive({chain, messageBytes, signature}) {}
}