import { useEffect, useMemo, useState } from "react";
import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite
} from "wagmi";
import { BigNumber, ethers } from "ethers";
import { useContractInfo } from "../../hooks/useContractInfo";

export const useContract = () => {
    // contract state
    const { address, isConnected } = useAccount();
    const contractInterface = useContractInfo();

    const [senderName, setSenderName] = useState("anon");
    const [senderMessage, setSenderMessage] = useState("Enjoy your coffee!");
    const [tipAmount, setTipAmount] = useState("0.001");

    const { data: _getMemos, refetch: fetchMemos } = useContractRead({
        ...contractInterface,
        functionName: "getMemos",
        cacheTime: Infinity,
        enabled: false
    });

    const getMemos = useMemo(() => {
        return _getMemos;
    }, [_getMemos]);

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
        senderName,
        senderMessage,
        tipAmount,
        setSenderName,
        setSenderMessage,
        setTipAmount
    };
};