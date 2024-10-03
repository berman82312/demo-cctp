import { CCTP } from "@/lib/CCTP";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, type DialogProps } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { type ChainConfig } from "../config/chains";
import { type Address, type Hash, type Hex } from '@/types/models'
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
    messageBytes?: Hex
    signature?: string
    receiveTxHash?: Hash
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
    const cctp = useRef<CCTP>()

    const showLoading = status.step !== 'signature' && status.step !== 'complete' && !status.errorMessage
    const showCancel = status.step === 'signature' || !!status.errorMessage

    useImperativeHandle(ref, () => {
        async function transfer(token: Address, amount: bigint, decimal: number, source: ChainConfig, fromAddress: Address, destination: ChainConfig, toAddress: Address) {
            setOpen(true)

            cctp.current = new CCTP(source, destination)
            let txHash: Hash
            try {
                txHash = await cctp.current.transfer(token, amount, fromAddress, toAddress)
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

                const messageBytes = await cctp.current.parseMessageBytes(txHash)
                updateRecord(txHash, {
                    status: 'signing',
                    messageBytes: messageBytes
                })
                setStatus(prev => ({
                    ...prev,
                    step: 'message',
                    message: 'Fetching signature, this may take a few minutes...',
                    messageBytes
                }))

                const signature = await cctp.current.getSignature(messageBytes)
                updateRecord(txHash, {
                    status: 'waiting',
                    signature
                })
                setStatus(prev => ({
                    ...prev,
                    step: 'signature',
                    message: `USDC transferred to ${destination.name}. Do you want to receive now?`,
                    signature
                }))
            } catch (err: unknown) {
                const error = err as Error
                if (error.message.includes('User rejected')) {
                    setStatus(InitStatus)
                    setOpen(false)
                    return
                }
                // Should handle error
                console.error(err)
                setStatus(prev => ({
                    ...prev,
                    errorMessage: error.message
                }))
                return
            }
        }
        return {
            transfer
        }
    }, [])


    function closeDialog() {
        setOpen(false)
        setStatus(InitStatus)
    }

    function clearError() {
        setStatus(prev => ({
            ...prev,
            errorMessage: null
        }))
    }

    async function receive() {
        if (!cctp.current || !status.messageBytes || !status.signature || !status.burnTxHash) {
            setStatus(prev => ({
                ...prev,
                errorMessage: 'Data broken!'
            }))
            return
        }

        clearError()

        try {
            const receiveTxHash = await cctp.current.receive(status.messageBytes, status.signature)
            updateRecord(status.burnTxHash, {
                status: 'receiving',
                receiveTxHash,
            })
            setStatus(prev => ({
                ...prev,
                step: 'receive',
                message: 'Receiving USDC...',
                receiveTxHash
            }))

            const receiveReceipt = await cctp.current.messageTransmitter.waitForReceipt(receiveTxHash)
            if (receiveReceipt.status === 'success') {
                updateRecord(status.burnTxHash, {
                    status: 'completed'
                })
                setStatus(prev => ({
                    ...prev,
                    step: 'complete',
                    message: 'USDC received!'
                }))
                return
            }
            updateRecord(status.burnTxHash, {
                status: 'error',
                errorMessage: 'Receive transaction status not success'
            })
            setStatus(prev => ({
                ...prev,
                errorMessage: 'Receive transaction status not success'
            }))
        } catch (err: unknown) {
            const error = err as Error
            setStatus(prev => ({
                ...prev,
                errorMessage: error.message
            }))
            return
        }
    }

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
                {showCancel ? <Button variant="contained" onClick={closeDialog}>Close</Button> : null}
                {status.step === 'signature' ? <Button variant="contained" onClick={receive}>Receive</Button> : null}
                {status.step === 'complete' ? <Button variant="contained" onClick={closeDialog}>Done</Button> : null}
            </DialogActions>
        </Dialog>
    )
})

TransferDialog.displayName = 'TransferDialog'