
import { VStack, Flex, Text, Button } from '@chakra-ui/react';

const Bridge = () => {
    return (
        <Flex width={"100%"} height={"100%"} borderRadius={"10"} alignItems={"left"}>
            <VStack alignItems={"left"} spacing={"3"}>
                <Text fontSize={"md"}>Visit OEV Network bridge to bridge your Ethereum to OEV Network.</Text>

                <Button onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}>Bridge Ethereum to OEV Network</Button>

            </VStack>
        </Flex>
    );
};

export default Bridge;