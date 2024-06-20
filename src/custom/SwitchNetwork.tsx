import { VStack, Heading, Flex, Spacer, Text, Image, Stack } from '@chakra-ui/react';
import { useAccount, useSwitchChain } from "wagmi";
import SignIn from './SignIn';
import ExecuteButton from './ExecuteButton';

const SwitchNetwork = ({ destinationChain = 4913, header = true, customMessage = "", switchMessage = "Switch Network" }: any) => {

    const { chain } = useAccount()
    const { switchChain, isPending } = useSwitchChain()

    const switchChain1 = () => {
        if (isPending) return
        switchChain?.({ chainId: parseInt(destinationChain) })
    }

    return (
        chain == null ? <SignIn></SignIn> :
            <VStack spacing={4} width={"100%"} alignItems={"left"} >
                {
                    header ?
                        <VStack spacing={4} alignItems={"left"}>
                            <Flex>
                                <Heading size={"lg"}>Switch Network</Heading>
                                <Spacer />
                                <Image src={`./caution.svg`} width={"30px"} height={"30px"} />
                            </Flex>

                            customMessage !== "" ?
                            <Text fontSize={"sm"}>{customMessage}</Text>
                            :
                            <Text fontSize={"sm"}>OevAuctionHouse contract is deployed on OEV Network. Please switch to OEV Network to proceed adding collateral funds or placing bids.</Text>

                        </VStack>

                        : null}
                <Stack alignItems={"center"} >
                    <ExecuteButton isDisabled={isPending || chain?.id === destinationChain} text={isPending ? "Switching" : switchMessage} onClick={() => switchChain1()}></ExecuteButton>
                </Stack>
            </VStack>
    );
};

export default SwitchNetwork;