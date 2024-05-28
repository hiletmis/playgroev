
import { useContext, useState } from 'react';
import { VStack } from '@chakra-ui/react';
import CustomHeading from '../custom/Heading';
import ExecuteButton from '../custom/ExecuteButton';
import AddCollateral from '../custom/AddCollateral';
import SignIn from '../custom/SignIn';
import { useAccount } from 'wagmi';
import SwitchNetwork from '../custom/SwitchNetwork';
import { OevContext } from '../OEVContext';
import { parseETH } from '../helpers/utils';

const Bridge = () => {
    const { chain } = useAccount()

    const { balance } = useContext(OevContext);
    const [ethAmount, setEthAmount] = useState("0.0");

    return (
        chain == null ? <SignIn></SignIn> :
            chain.id !== 4913 ? <SwitchNetwork /> :
                <VStack alignItems={"left"} spacing={5}>
                    <CustomHeading header={"Deposit Collateral"} description={"Depoist your Ethereum to start placing bids."} isLoading={false}></CustomHeading>
                    <AddCollateral tokenAmount={ethAmount} setTokenAmount={setEthAmount} tokenBalance={parseETH(balance)} ></AddCollateral>

                    <ExecuteButton
                        text={'Deposit Collateral'}
                        isDisabled={ethAmount === "" || parseFloat(ethAmount) <= 0 || parseFloat(ethAmount) > parseFloat(parseETH(balance))}
                        onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}>

                    </ExecuteButton>
                </VStack>
    );
};

export default Bridge;