import { createContext } from 'react';

export interface AppContext {
    address: string;
    setAddress: (wallet: string) => void;
    balance: bigint;
    setBalance: (balance: bigint) => void;
}

export const OevContext = createContext<AppContext>({} as AppContext);
