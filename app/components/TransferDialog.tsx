import { CCTP } from "@/lib/CCTP";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, type DialogProps } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import { type ChainConfig } from "../config/chains";
import { type Address, type Hash } from '@/types/models'
import { useTransferRecordsStore } from "@/stores/transferRecords";
import { formatUnits } from "viem";

export type TransferDialog = {
    transfer: (token: Address, amount: bigint, decimal: number, source: ChainConfig, fromAddress: Address, destination: ChainConfig, toAddress: Address) => void
}

type TransferDialogStatus = {
    step: 'approve' | 'burn' | 'message' | 'signature' | 'receive' | 'complete'
    message: string
    errorMessage: string | null
    burnTxHash?: Hash
    messageHash?: Hash
    signature?: string
}

const InitStatus = {
    step: 'approve',
    message: 'Take action in your wallet...',
    errorMessage: null
} as const

export const TransferDialog = forwardRef<TransferDialog>((props, ref) => {
    const addRecord = useTransferRecordsStore(state => state.addRecord)
    const updateRecord = useTransferRecordsStore(state => state.updateRecord)

    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<TransferDialogStatus>(InitStatus)

    const showLoading = status.step !== 'signature' && !status.errorMessage

    useImperativeHandle(ref, () => {
        return {
            transfer
        }
    }, [])

    async function transfer(token: Address, amount: bigint, decimal: number, source: ChainConfig, fromAddress: Address, destination: ChainConfig, toAddress: Address) {
        setOpen(true)

        const cctp = new CCTP(source, destination)
        let txHash: Hash
        try {
            txHash = await cctp.transfer(token, amount, fromAddress, toAddress)
            addRecord({
                status: 'burning',
                fromChainId: source.id,
                fromAddress,
                toChainId: destination.id,
                toAddress,
                amount: formatUnits(amount, decimal),
                burnTxHash: txHash,
            })
            setStatus(prev => ({
                ...prev,
                step: 'burn',
                message: 'Fetching message hash...',
                burnTxHash: txHash
            }))
        } catch (err: any) {
            if (err.message.includes('User rejected')) {
                setStatus(InitStatus)
                setOpen(false)
                return
            }
            console.error(err)
            setStatus(prev => ({
                ...prev,
                errorMessage: err.message
            }))
            return
        }

        const messageHash = await cctp.parseMessageHash(txHash)
        updateRecord(txHash, {
            status: 'signing',
            messageHash
        })
        setStatus(prev => ({
            ...prev,
            step: 'message',
            message: 'Fetching signature...',
            burnTxHash: txHash
        }))

        const signature = await cctp.getSignature(messageHash)
        updateRecord(txHash, {
            status: 'waiting',
            signature
        })
        setStatus(prev => ({
            ...prev,
            step: 'signature',
            message: `USDC transferred to ${destination.name}. Do you want to receive now?`,
            burnTxHash: txHash
        }))
    }

    function closeDialog() {
        setOpen(false)
        setStatus(InitStatus)
    }

    function receive() { }

    const onClose: DialogProps['onClose'] = (event, reason) => {
        console.log("Close: ", event, reason)
        if (reason === 'backdropClick') {
            return
        }
        closeDialog()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Transfer USDC</DialogTitle>
            <DialogContent>
                {status.errorMessage ?? status.message}
            </DialogContent>
            <DialogActions>
                {showLoading ? <div className="flex w-full justify-center p-4"><CircularProgress /></div> : null}
                {status.errorMessage ? <Button variant="contained" onClick={closeDialog}>Close</Button> : null}
                {status.step === 'signature' ? <Button variant="contained" onClick={receive}>Receive</Button> : null}
            </DialogActions>
        </Dialog>
    )
})