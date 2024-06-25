import './App.css';
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { VStack, Flex } from '@chakra-ui/react';
import Header from './components/Header';
import Welcome from './components/Welcome';
import { OevContext } from './OEVContext';
import { BidPrices, BidInfo } from './types';
import { useAccount } from 'wagmi';

function App() {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(BigInt(0));
  const [ethereumBalance, setEthereumBalance] = useState(BigInt(0));
  const [stage, setStage] = useState(0);
  const [tab, setTab] = useState(0);
  const [prices, setPrices] = useState({} as BidPrices);
  const [isBiddable, setIsBiddable] = useState(true);
  const [bid, setBid] = useState(undefined as BidInfo | undefined);

  const { chain } = useAccount()


  useEffect(() => {
    if (chain == null) {
      setStage(-1);
      setTab(0);
    }
  }, [chain]);


  return (
    <HashRouter>
      <OevContext.Provider value={{ address, setAddress, balance, setBalance, ethereumBalance, setEthereumBalance, stage, setStage, tab, setTab, prices, setPrices, isBiddable, setIsBiddable, bid, setBid }}>
        <Header />
        <Flex h="calc(100vh - 90px)" p={5} alignItems={'stretch'} flexDirection={'row'}>
          <VStack width={'100%'} alignItems={'center'}>
            <Routes>
              <Route path="/" element={<Welcome />} />
            </Routes>
          </VStack>
        </Flex>
      </OevContext.Provider>
    </HashRouter>
  );
}

export default App;
