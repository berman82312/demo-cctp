import { Address } from "@/app/types/models";
import { erc20Abi, formatEther, formatUnits } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";

type UserBalanceProps = {
    address: Address;
    token: Address;
    chainId: number;
}

export const UserBalance = (props: UserBalanceProps) => {
    const {
        address,
        token,
        chainId
    } = props;
    const { data, error, isError, isFetching } = useReadContract({
        chainId: chainId,
        abi: erc20Abi,
        address: token,
        functionName: 'balanceOf',
        args: [address]
    })
    const {data: decimal} = useReadContract({
       chainId: chainId,
       abi: erc20Abi,
       address: token,
       functionName: 'decimals',
       args: [] 
    })

    if (isFetching || isError || !decimal) {
        return null
    }

    return (
        <span>{formatUnits(data ?? BigInt(0), decimal)} USDC</span>
    )
}