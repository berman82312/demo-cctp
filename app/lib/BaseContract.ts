import { parseEventLogs } from 'viem';
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { type Abi, type Address, type TransactionReceipt, type Hash } from '@/types/models'
import { config } from '../config/WagmiConfig';

export class BaseContract {
    abi: Abi
    address: Address

    constructor(abi: Abi, address: Address) {
        this.abi = abi;
        this.address = address;
    }

    async read<T>(functionName: string, args: Array<any>): Promise<T> {
        const result = await readContract(config, {
            abi: this.abi,
            address: this.address,
            functionName: functionName,
            args: args,
        });

        return result as T;
    }

    async write(functionName: string, args: Array<any>, value?: bigint) {
        const result = await writeContract(config, {
            abi: this.abi,
            address: this.address,
            functionName,
            args: args,
            value
        });

        return result;
    }

    async waitForReceipt(txHash: Hash) {
        const txReceipt = await waitForTransactionReceipt(config, {
            hash: txHash
        })

        return txReceipt
    }

    parseReceiptLogs(receipt: TransactionReceipt, eventName?: string, abi?: Abi) {
        let logs = parseEventLogs({
            abi: abi ?? this.abi,
            eventName,
            logs: receipt.logs,
        });

        return logs;
    }
}

export default BaseContract;