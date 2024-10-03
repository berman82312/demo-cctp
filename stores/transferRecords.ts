import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type Hash, type Hex, type Address } from '@/types/models'
import { type ChainConfig } from '@/app/config/chains'

export type TransferRecord = {
    status: 'burning' | 'signing' | 'waiting' | 'receiving' | 'completed' | 'error',
    fromChainId: ChainConfig['id'],
    fromAddress: Address,
    toChainId: ChainConfig['id'],
    toAddress: Address,
    amount: string,
    burnTxHash: Hash,
    messageBytes?: Hex,
    signature?: string,
    receiveTxHash?: Hash,
    errorMessage?: string
}

type RecordState = {
    records: TransferRecord[]
}

type RecordAction = {
    addRecord: (record: TransferRecord) => void,
    removeRecord: (burnTxHash: Hash) => void,
    updateRecord: (burnTxHash: Hash, payload: Partial<TransferRecord>) => void
}

type RecordStore = RecordState & RecordAction

const EmptyState: RecordState = {
    records: []
}

export const useTransferRecordsStore = create<RecordStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...EmptyState,
                addRecord(record) {
                    const preRecords = get().records
                    set({
                        records: [record].concat(preRecords)
                    })
                },
                removeRecord(burnTxHash) {
                    const preRecords = get().records
                    set({
                        records: preRecords.filter(record => record.burnTxHash !== burnTxHash)
                    })
                },
                updateRecord(burnTxHash, payload) {
                    const preRecords = get().records
                    set({
                        records: preRecords.map(record => {
                            if (record.burnTxHash === burnTxHash) {
                                record = Object.assign({}, record, payload)
                            }
                            return record
                        })
                    })
                },
            }),
            {
                name: 'transfer-records'
            }
        )
    )
)