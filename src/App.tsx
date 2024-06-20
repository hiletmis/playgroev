import './App.css';
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { VStack, Flex } from '@chakra-ui/react';
import Header from './components/Header';
import Welcome from './components/Welcome';
import { OevContext } from './OEVContext';
import { BidPrices, BidInfo } from './types';

function App() {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(BigInt(0));
  const [stage, setStage] = useState(0);
  const [prices, setPrices] = useState({} as BidPrices);
  const [isBiddable, setIsBiddable] = useState(false);
  const [bid, setBid] = useState(undefined as BidInfo | undefined);

  return (
    <HashRouter>
      <OevContext.Provider value={{ address, setAddress, balance, setBalance, stage, setStage, prices, setPrices, isBiddable, setIsBiddable, bid, setBid }}>
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
