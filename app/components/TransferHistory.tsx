import { useState } from "react"
import { Close } from "@mui/icons-material"
import { Button, Card, CardActions, CardContent, CardHeader, Chip, CircularProgress, IconButton, Link } from "@mui/material"
import { CCTP } from "@/lib/CCTP"
import { useTransferRecordsStore, type TransferRecord as RecordType } from "@/stores/transferRecords"
import { type Hash } from '@/types/models'
import { maskedHash } from "@/utils/formatUtils"
import { AllChains } from "../config/chains"

export const TransferHistory = () => {
    const records = useTransferRecordsStore(state => state.records)
    return (
        <div>
            {records.map(record => <TransferRecord record={record} key={`history_${record.burnTxHash}`} />)}
        </div>
    )
}

const TransferRecord = ({ record }: { record: RecordType }) => {
    const updateRecord = useTransferRecordsStore(state => state.updateRecord)
    const removeRecord = useTransferRecordsStore(state => state.removeRecord)

    const [status, setStatus] = useState({
        isLoading: false,
        errorMessage: null
    })

    const sourceChain = AllChains.find(chain => chain.id === record.fromChainId)
    const destinationChain = AllChains.find(chain => chain.id === record.toChainId)

    const canSync = !['waiting', 'completed'].includes(record.status) && !status.isLoading
    const canReceive = record.status === 'waiting' && !status.isLoading

    function getStatusLabel(status: RecordType['status']) {
        switch (status) {
            case 'completed':
                return 'Done'
            case 'waiting':
                return 'Can Receive'
            case 'receiving':
                return 'Receiving'
            default:
                return 'Transfering'
        }
    }

    function remove() {
        removeRecord(record.burnTxHash)
    }

    async function sync() {
        if (!sourceChain) {
            return
        }

        setStatus(prev => ({
            ...prev,
            isLoading: true,
            errorMessage: null
        }))
        try {
            const cctp = new CCTP(sourceChain, destinationChain!)
            await cctp.checkChain(sourceChain)

            let messageBytes = record.messageBytes
            if (!messageBytes) {
                messageBytes = await cctp.parseMessageBytes(record.burnTxHash)
                updateRecord(record.burnTxHash, {
                    status: 'signing',
                    messageBytes
                })
            }

            let signature = record.signature
            if (!signature) {
                signature = await cctp.getSignature(messageBytes)
                updateRecord(record.burnTxHash, {
                    status: 'waiting',
                    signature
                })
            }

            if (record.receiveTxHash && record.status !== 'completed') {
                await syncReceiveStatus(record.receiveTxHash)
            }
        } catch (err: any) {
            if (err.message.includes('User rejected')) {
                return
            }
            setStatus(prev => ({
                ...prev,
                errorMessage: err.message
            }))
        } finally {
            setStatus(prev => ({
                ...prev,
                isLoading: false
            }))
        }
    }

    async function receive() {
        if (!sourceChain || !destinationChain) {
            return
        }
        setStatus(prev => ({
            ...prev,
            isLoading: true,
            errorMessage: null
        }))
        try {


            const cctp = new CCTP(sourceChain, destinationChain)

            let receiveTxHash = record.receiveTxHash
            if (!receiveTxHash) {
                receiveTxHash = await cctp.receive(record.messageBytes, record.signature)
                updateRecord(record.burnTxHash, {
                    status: 'receiving',
                    receiveTxHash
                })
            }

            await syncReceiveStatus(receiveTxHash)
        } catch(err: any) {
            if (err.message.includes('User rejected')) {
                return
            }
            setStatus(prev => ({
                ...prev,
                errorMessage: err.message
            }))
        } finally {
            setStatus(prev => ({
                ...prev,
                isLoading: false
            }))
        }
    }

    async function syncReceiveStatus(receiveTxHash: Hash) {
        if (!sourceChain || !destinationChain) {
            return
        }

        const cctp = new CCTP(sourceChain, destinationChain)
        const receipt = await cctp.messageTransmitter.waitForReceipt(receiveTxHash)

        if (receipt.status === 'success') {
            updateRecord(record.burnTxHash, {
                status: 'completed'
            })
        }
    }

    return (
        <Card className="my-4 min-w-[270px] max-w-[375px]">
            <CardHeader
                avatar={
                    <Chip label={getStatusLabel(record.status)} />
                }
                action={
                    <IconButton onClick={remove}>
                        <Close />
                    </IconButton>
                }
            />
            <CardContent>
                <p className="mb-2">Transfer TX: <Link href={`${sourceChain?.explorerUrl}/tx/${record.burnTxHash}`} target="_blank">{maskedHash(record.burnTxHash)}</Link></p>
                {record.receiveTxHash ? <p className="mb-2">Receive TX:<Link href={`${destinationChain?.explorerUrl}/tx/${record.receiveTxHash}`} target="_blank">{maskedHash(record.receiveTxHash)}</Link></p> : null}
                {!!status.errorMessage && <p className="text-danger">{status.errorMessage}</p>}
            </CardContent>
            <CardActions>
                {status.isLoading && <CircularProgress />}
                {canSync && <Button variant="outlined" onClick={sync}>Sync status</Button>}
                {canReceive && <Button variant="outlined" onClick={receive}>Receive</Button>}
            </CardActions>
        </Card>
    )
}