'use client'

import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AllChains, ChainConfig } from '../config/chains';
import { useAccount } from 'wagmi';
import { AccountBalance } from './AccountBalance';
import { ChainItem } from './ChainItem';

export default function SourceForm() {
  const { address } = useAccount()
  const [source, setSource] = useState<ChainConfig['id']>('');

  const sourceChain = AllChains.find(chain => chain.id === source)
  const showBalance = !!address && !!sourceChain

  const handleChange = (event: SelectChangeEvent) => {
    setSource(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 240 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">From Chain</InputLabel>
        <Select
          labelId="source-chain-select-label"
          id="source-chain-select"
          value={source}
          label="From Chain"
          onChange={handleChange}
        >
          {AllChains.map(chain => (
            <MenuItem value={chain.id} key={`chain_item_${chain.id}`}>
              <ChainItem chain={chain} />
            </MenuItem>
          ))}
        </Select>
        {showBalance && (<p className="py-4">Balance: <AccountBalance address={address} chainId={sourceChain.chainId} token={sourceChain.usdc} /></p>)}
      </FormControl>
    </Box>
  );
}
