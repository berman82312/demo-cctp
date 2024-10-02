import { erc20Abi } from "viem";
import BaseContract from "./BaseContract";
import { type Address } from '@/app/types/models'

export class ERC20 extends BaseContract {
    constructor(address: Address) {
        super(erc20Abi, address)
    }
    async allowance(owner: Address, spender: Address) {
        const result = await this.read<bigint>('allowance', [owner, spender])
        return result
    }

    async approveCheck(owner: Address, spender: Address, amount: bigint) {
        const allowance = await this.allowance(owner, spender)

        if (allowance >= amount) {
            return true
        }

        const txHash = await this.approve(spender, amount)
        await this.waitForReceipt(txHash)

        return true
    }

    async approve(address: Address, amount: bigint) {
        const txHash = await this.write('approve', [address, amount])

        return txHash
    }
}