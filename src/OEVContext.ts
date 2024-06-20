import { createContext } from 'react';
import { BidInfo, BidPrices } from './types';

export interface AppContext {
    address: string;
    setAddress: (wallet: string) => void;
    balance: bigint;
    setBalance: (balance: bigint) => void;
    stage: number;
    setStage: (stage: number) => void;
    prices: BidPrices;
    setPrices: (prices: BidPrices) => void;
    isBiddable: boolean;
    setIsBiddable: (isBiddable: boolean) => void;
    bid?: BidInfo;
    setBid: (bid?: BidInfo) => void;
}

export const OevContext = createContext<AppContext>({} as AppContext);
