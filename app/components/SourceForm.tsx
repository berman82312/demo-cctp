'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ListItemIcon, ListItemText } from '@mui/material';
import Image from 'next/image';
import { BaseSepolia, Sepolia } from '../config/chains';

export default function SourceForm() {
  const [source, setSource] = React.useState('');

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
          <MenuItem value={Sepolia.id}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <ListItemIcon>
                <Image src={Sepolia.icon} height={32} width={32} alt={Sepolia.name}/>
              </ListItemIcon>
              <ListItemText>{Sepolia.name}</ListItemText>
            </div>
          </MenuItem>
          <MenuItem value={BaseSepolia.id}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <ListItemIcon>
                <Image src={BaseSepolia.icon} height={32} width={32} alt={BaseSepolia.name}/>
              </ListItemIcon>
              <ListItemText>{BaseSepolia.name}</ListItemText>
            </div>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}