'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AllChains } from '../config/chains';
import { ChainItem } from './ChainItem';
import { useAccount } from 'wagmi';
import { AccountBalance } from './AccountBalance';

export default function DestinationForm() {
  const { address } = useAccount()
  const [destination, setDestination] = React.useState('');

  const destinationChain = AllChains.find(chain => chain.id === destination)
  const showBalance = !!address && !!destinationChain

  const handleChange = (event: SelectChangeEvent) => {
    setDestination(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 240 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">To Chain</InputLabel>
        <Select
          labelId="destination-chain-select-label"
          id="destination-chain-select"
          value={destination}
          label="To Chain"
          onChange={handleChange}
        >
          {AllChains.map(chain => (
            <MenuItem value={chain.id} key={`chain_item_${chain.id}`}>
              <ChainItem chain={chain} />
            </MenuItem>
          ))}
        </Select>
        {showBalance && (<p className="py-4">Balance: <AccountBalance address={address} chainId={destinationChain.chainId} token={destinationChain.usdc} /></p>)}
      </FormControl>
    </Box>
  );
}