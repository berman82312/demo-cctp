'use client';

import { ListItemIcon, ListItemText } from "@mui/material";
import Image from "next/image";
import { ChainConfig } from "../config/chains";

export function ChainItem({ chain }: { chain: ChainConfig; }) {
  return (
    <div style={{ display: 'flex' }}>
      <ListItemIcon>
        <Image src={chain.icon} height={32} width={32} alt={chain.name} />
      </ListItemIcon>
      <ListItemText>{chain.name}</ListItemText>
    </div>
  );
}
