
import { VStack, Flex } from '@chakra-ui/react';
import CustomHeading from '../custom/Heading';
import ExecuteButton from '../custom/ExecuteButton';

const Bridge = () => {
    return (
        <Flex width={"100%"} height={"100%"} borderRadius={"10"} alignItems={"left"}>
            <VStack alignItems={"left"} spacing={"3"}>
                <CustomHeading header={"Deposit Collateral"} description={"Visit OEV Network bridge to bridge your Ethereum to OEV Network."} isLoading={false}></CustomHeading>
                <ExecuteButton
                    text={'Bridge Ethereum to OEV Network'}
                    onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}>
                </ExecuteButton>
            </VStack>
        </Flex>
    );
};

export default Bridge;