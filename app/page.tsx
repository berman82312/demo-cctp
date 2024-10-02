'use client'

import { useState } from "react";
import { Button, Divider, InputAdornment, TextField } from "@mui/material";
import ConnectButton from "./components/ConnectButton";
import SourceForm from "./components/SourceForm";
import DestinationForm from "./components/DestinationForm";
import ChainSelector from "./components/ChainSelector";
import { AllChains, ChainConfig } from "./config/chains";
import { useAccount } from "wagmi";
import { AccountBalance } from "./components/AccountBalance";

export default function Home() {
  const { address } = useAccount()
  const [source, setSource] = useState<ChainConfig>()
  const [destination, setDestination] = useState<ChainConfig>()
  const [amount, setAmount] = useState('')

  const sameChain = !!source?.id && source?.id === destination?.id
  const showSourceBalance = !!address && !!source
  const showDestinationBalance = !!address && !!destination
  const isValidAmount = Number(amount) > 0
  const canTransfer = source && destination && isValidAmount && !sameChain;

  function onSelectSource(id: ChainConfig['id']) {
    setSource(AllChains.find(chain => chain.id === id))
  }

  function onSelectDestination(id: ChainConfig['id']) {
    setDestination(AllChains.find(chain => chain.id === id))
  }

  function transfer() {
    console.log(`Transfer: ${amount} USDC from ${source?.name} to ${destination?.name}`)
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ConnectButton />
        <h2 className="text-2xl">Transfer your USDC</h2>
        <ChainSelector
          selectedId={source?.id}
          options={AllChains}
          onSelect={onSelectSource}
          idPrefix="source-chain"
          label="From chain" />
        {showSourceBalance && (<p className="-mt-6">Balance: <AccountBalance address={address} chainId={source.chainId} token={source.usdc} /></p>)}
        <TextField
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
        />
        <Divider className="w-full">To</Divider>
        <ChainSelector
          errorMessage={sameChain ? 'Please select a different chain' : undefined}
          selectedId={destination?.id}
          options={AllChains}
          onSelect={onSelectDestination}
          idPrefix="destination-chain"
          label="To chain" />
        {showDestinationBalance && (<p className="-mt-6">Balance: <AccountBalance address={address} chainId={destination.chainId} token={destination.usdc} /></p>)}
        <Button disabled={!canTransfer} variant="contained" onClick={transfer}>Transfer</Button>
      </main>
    </div>
  );
}
