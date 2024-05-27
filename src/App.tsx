import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { VStack, Flex } from '@chakra-ui/react';
import Header from './components/Header';
import Welcome from './components/Welcome';

function App() {

  return (
    <HashRouter>
      <Header />
      <Flex h="calc(100vh - 90px)" p={5} alignItems={'stretch'} flexDirection={'row'}>
        <VStack width={'100%'} alignItems={'center'}>
          <Routes>
            <Route path="/" element={<Welcome />} />
          </Routes>
        </VStack>
      </Flex>
    </HashRouter>
  );
}

export default App;
