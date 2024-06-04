import './App.css';
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { VStack, Flex } from '@chakra-ui/react';
import Header from './components/Header';
import Welcome from './components/Welcome';
import { OevContext } from './OEVContext';

function App() {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(BigInt(0));

  return (
    <HashRouter>
      <OevContext.Provider value={{ address, setAddress, balance, setBalance }}>
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
