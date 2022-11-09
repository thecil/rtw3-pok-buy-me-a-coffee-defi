import abi from "../data/ABI.json";

export interface ContractInterface {
    addressOrName: string;
    contractInterface: any;
    chainId: number;
}

export const useContractInfo = (): ContractInterface => {   
    return {
        addressOrName    : '0xa38D568602b4D32692BdD2Ec9FcA991fFeFe0521',
        contractInterface: abi,
        chainId          : 5
      };
};

