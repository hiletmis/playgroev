import { VStack, Heading, Flex, Spacer, Text, Box, Image, Stack, Button } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';
import { useAccount, useSwitchChain } from "wagmi";
import SignIn from './SignIn';
import { ChainLogo } from '@api3/logos';

const Hero = () => {

    const { chain } = useAccount()
    const { switchChain, isPending } = useSwitchChain()

    const switchChain1 = () => {
        if (isPending) return
        switchChain?.({ chainId: 4913 })
    }

    return (
        chain == null ? <SignIn></SignIn> :
            <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"} alignItems={"left"} >
                <Flex>
                    <Heading size={"lg"}>Switch Network</Heading>
                    <Spacer />
                    <Image src={`./caution.svg`} width={"30px"} height={"30px"} />
                </Flex>

                <Text fontSize={"sm"}>OevAuctionHouse contract is deployed on OEV Network. Please switch to OEV Network to proceed adding collateral funds or placing bids.</Text>

                <Box width={"100%"} height="85px" bgColor={COLORS.app} borderRadius={"10"}>
                    <VStack spacing={3} direction="row" align="left" m="1rem">
                        <Flex>
                            <Spacer />

                            <Image src={ChainLogo(chain.id.toString())} fallbackSrc="./caution.svg" width={"50px"} height={"50px"} />
                            <Spacer />
                            <Image src={`./switch.svg`} width={"50px"} height={"50px"} />
                            <Spacer />
                            <Image src={ChainLogo("4913")} width={"50px"} height={"50px"} />
                            <Spacer />

                        </Flex>
                    </VStack>
                </Box>
                <Stack alignItems={"center"} >
                    <Button
                        borderColor="gray.500"
                        borderWidth="1px"
                        color="black"
                        size="md"
                        minWidth={"200px"}
                        isDisabled={isPending || chain?.id === 4913}
                        onClick={switchChain1}
                    >
                        {isPending ? "Switching" : "Switch Network"}
                    </Button>
                </Stack>
            </VStack>
    );
};

export default Hero;