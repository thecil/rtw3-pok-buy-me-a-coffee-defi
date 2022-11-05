import { useEffect, useMemo, useState } from "react";
import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite
} from "wagmi";
import { ethers } from "ethers";
import { useContractInfo } from "../../hooks/useContractInfo";

export const useContract = () => {
    // contract state
    const { address, isConnected } = useAccount();
    const contractInterface = useContractInfo();

    const [senderName, setSenderName] = useState("anon");
    const [senderMessage, setSenderMessage] = useState("Enjoy your coffee!");
    const [tipAmount, setTipAmount] = useState("0.001");

    const { data: memos, refetch: fetchMemos, isRefetching } = useContractRead({
        ...contractInterface,
        functionName: "getMemos",
        cacheTime: Infinity,
        enabled: false,
        watch: true,
    });

    const getMemos = useMemo(() => {
        const result = memos as unknown as any[];
        return result;
    }, [memos]);

    useEffect(() => {
        if (isConnected) fetchMemos();
    }, [isConnected, fetchMemos]);

    // wagmi prepareContractWrite config for 'buyCoffee'
    const { config } = usePrepareContractWrite({
        ...contractInterface,
        functionName: "buyCoffee",
        args: [senderName, senderMessage],
        overrides: {
            from: address,
            gasLimit: "300000",
            value: ethers.utils.parseEther(tipAmount)
        }
    });

    const buyCoffee = useContractWrite({
        ...config,
    });

    return {
        buyCoffee,
        getMemos,
        fetchMemos,
        isRefetching,
        senderName,
        senderMessage,
        tipAmount,
        setSenderName,
        setSenderMessage,
        setTipAmount
    };
};