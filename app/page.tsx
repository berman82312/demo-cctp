'use client'

import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Button, Divider, InputAdornment, TextField } from "@mui/material";
import ConnectButton from "./components/ConnectButton";
import ChainSelector from "./components/ChainSelector";
import { AllChains, ChainConfig } from "./config/chains";
import { useAccountBalance } from "../hooks/useAccountBalance";
import { formatUnits, parseUnits } from "viem";
import { TransferDialog } from "./components/TransferDialog";
import { TransferHistory } from "./components/TransferHistory";

export default function Home() {
  const { address } = useAccount()
  const [source, setSource] = useState<ChainConfig>()
  const [destination, setDestination] = useState<ChainConfig>()
  const [amount, setAmount] = useState('')
  const transferDialogRef = useRef<TransferDialog>()

  const { balance: sourceBalance, decimal: sourceTokenDecimal, isSuccess } = useAccountBalance({ address, token: source?.usdc, chainId: source?.chainId })
  const { balance: destinationBalance, decimal: destinationDecimal, isSuccess: isDestinationSuccess } = useAccountBalance({ address, token: destination?.usdc, chainId: destination?.chainId })

  const sameChain = !!source?.id && source?.id === destination?.id
  const showSourceBalance = isSuccess
  const showDestinationBalance = isDestinationSuccess 
  const isValidAmount = amount === '' || Number(amount) >= 0
  const isNotZero = Number(amount) > 0
  const isEnoughBalance = sourceBalance && sourceTokenDecimal && parseUnits(amount, sourceTokenDecimal) <= sourceBalance
  const canTransfer = source && destination && isValidAmount && isNotZero && isEnoughBalance && !sameChain && !!address;

  function onSelectSource(id: ChainConfig['id']) {
    setSource(AllChains.find(chain => chain.id === id))
  }

  function onSelectDestination(id: ChainConfig['id']) {
    setDestination(AllChains.find(chain => chain.id === id))
  }

  function transfer() {
    if (!canTransfer) {
      return
    }
    transferDialogRef.current?.transfer(source.usdc, parseUnits(amount, sourceTokenDecimal), sourceTokenDecimal, source, address, destination, address)
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ConnectButton />
        <h2 className="text-2xl">Transfer your USDC</h2>
        <ChainSelector
          selectedId={source?.id ?? ''}
          options={AllChains}
          onSelect={onSelectSource}
          idPrefix="source-chain"
          label="From chain" />
        {showSourceBalance && (<p className="-mt-6">Balance: {formatUnits(sourceBalance!, sourceTokenDecimal!)}</p>)}
        <TextField
          fullWidth
          error={amount !== '' && (!isValidAmount || !isNotZero || !isEnoughBalance)}
          type="number"
          label="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <p className="mr-2">USDC</p>
                </InputAdornment>
              )
            },
            htmlInput: {
              step: '0.1'
            }
          }}
          helperText={amount !== '' ? isValidAmount ? isNotZero ? isEnoughBalance ? undefined : 'Not enough balance' : 'Should not be 0' : 'Invalid amount' : undefined}
        />
        <Divider className="w-full">To</Divider>
        <ChainSelector
          errorMessage={sameChain ? 'Please select a different chain' : undefined}
          selectedId={destination?.id ?? ''}
          options={AllChains}
          onSelect={onSelectDestination}
          idPrefix="destination-chain"
          label="To chain" />
        {showDestinationBalance && (<p className="-mt-6">Balance: {formatUnits(destinationBalance!, destinationDecimal!)}</p>)}
        <Button fullWidth disabled={!canTransfer} variant="contained" onClick={transfer}>Transfer</Button>
        <TransferDialog ref={transferDialogRef} />
        <p className="mt-4">Transfer History</p>
        <TransferHistory />
      </main>
    </div>
  );
}
