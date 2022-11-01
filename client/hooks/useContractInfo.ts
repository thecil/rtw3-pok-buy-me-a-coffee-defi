import abi from "../data/ABI.json";

export interface ContractInterface {
    addressOrName: string;
    contractInterface: any;
    chainId: number;
}

export const useContractInfo = (): ContractInterface => {   
    return {
        addressOrName    : '0x28cd3D2d2f00f4EE0ea2450756e6b6102a598F3c',
        contractInterface: abi,
        chainId          : 5
      };
};

