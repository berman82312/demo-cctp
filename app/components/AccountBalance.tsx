import { Address } from "@/types/models";
import { erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";

type AccountBalanceProps = {
    address: Address;
    token: Address;
    chainId: number;
}

export const AccountBalance = (props: AccountBalanceProps) => {
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

    return `${formatUnits(data ?? BigInt(0), decimal)} USDC`
}