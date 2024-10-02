
'use client'

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AllChains, ChainConfig } from '../config/chains';
import { ChainItem } from './ChainItem';
import { FormHelperText } from '@mui/material';

export interface ChainSelectorProps {
    selectedId?: ChainConfig['id'],
    options: ChainConfig[],
    label: string,
    idPrefix: string,
    onSelect: (id: ChainConfig['id']) => void,
    errorMessage?: string,
}

export default function ChainSelector(props: ChainSelectorProps) {
    const { options, selectedId, onSelect, label, idPrefix, errorMessage } = props;

    const source = options.find(chain => chain.id === selectedId)

    const handleChange = (event: SelectChangeEvent) => {
        onSelect(event.target.value)
    };

    return (
        <Box sx={{ minWidth: 240 }}>
            <FormControl fullWidth error={!!errorMessage}>
                <InputLabel id={`${idPrefix}-input-label`}>{label}</InputLabel>
                <Select
                    labelId={`${idPrefix}-select-label`}
                    id={`${idPrefix}-select`}
                    value={selectedId}
                    label={label}
                    onChange={handleChange}
                >
                    {AllChains.map(chain => (
                        <MenuItem value={chain.id} key={`chain_item_${chain.id}`}>
                            <ChainItem chain={chain} />
                        </MenuItem>
                    ))}
                </Select>
                {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
            </FormControl>
        </Box>
    );
}
