import { VStack, Heading, Flex, Spacer, Text, Image } from '@chakra-ui/react';

const Hero = () => {
    return (
        <VStack spacing={4} alignItems={"left"} >
            <Flex>
                <Heading size={"lg"}>Wrong Network</Heading>
                <Spacer />
                <Image src={`./caution.svg`} width={"30px"} height={"30px"} />
            </Flex>
            <Text fontSize={"sm"}>Please change network to OEV Chain.</Text>
        </VStack>
    );
};

export default Hero;