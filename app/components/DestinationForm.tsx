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

export default function DestinationForm() {
  const [destination, setDestination] = React.useState('');

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