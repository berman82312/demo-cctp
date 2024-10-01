'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ListItemIcon, ListItemText } from '@mui/material';
import Image from 'next/image';
import SepoliaIcon from '@/app/icons/sepolia.svg';
import BaseSepoliaIcon from '@/app/icons/base-sepolia.svg';

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
          <MenuItem value={'sepolia'}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <ListItemIcon>
                <Image src={SepoliaIcon} height={32} width={32} alt="Sepolia" />
              </ListItemIcon>
              <ListItemText>Sepolia</ListItemText>
            </div>
          </MenuItem>
          <MenuItem value={'base_sepolia'}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <ListItemIcon>
                <Image src={BaseSepoliaIcon} height={32} width={32} alt="Base Sepolia" />
              </ListItemIcon>
              <ListItemText>Base Sepolia</ListItemText>
            </div>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}