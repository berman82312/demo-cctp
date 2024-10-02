
import { Address } from "@/types/models";
import { erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";

type UseAccountBalancePayload = {
    address?: Address;
    token?: Address;
    chainId?: number;
}

const EmptyAddress = '0x0'

export const useAccountBalance = (payload: UseAccountBalancePayload) => {
    const {
        address,
        token,
        chainId
    } = payload;
    
    const { data, isSuccess } = useReadContract({
        chainId: chainId,
        abi: erc20Abi,
        address: token,
        functionName: 'balanceOf',
        args: [address ?? EmptyAddress]
    })
    const {data: decimal, isSuccess: isDecimalSuccess} = useReadContract({
       chainId: chainId,
       abi: erc20Abi,
       address: token,
       functionName: 'decimals',
       args: [] 
    })
    
    let balance

    if (isSuccess && isDecimalSuccess) {
        balance = formatUnits(data, decimal)
    }

    return {
        balance,
        decimal
    }
}