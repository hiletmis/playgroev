
import { useContext, useEffect } from 'react';
import { Button, VStack, Flex, Text, Spacer } from '@chakra-ui/react';
import CustomHeading from '../custom/Heading';
import SignIn from '../custom/SignIn';
import { useAccount } from 'wagmi';
import SwitchNetwork from '../custom/SwitchNetwork';
import { OevContext } from '../OEVContext';
import { COLORS, parseETH } from '../helpers/utils';
import { StageEnum } from '../types';
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import { useReadContract } from 'wagmi';

const Bridge = () => {
    const { chain, address } = useAccount()

    const { balance, stage, setStage } = useContext(OevContext);
    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`

    //@ts-ignore
    const { data: bidderBalance } = useReadContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chain ? chain.id : 4913,
        functionName: 'bidderToBalance',
        args: [address as `0x${string}`],
        query: {
            refetchInterval: 10000,
        }
    });

    useEffect(() => {
        if (balance === BigInt(0)) {
            setStage(StageEnum.Bridge);
            return;
        }

        if (stage === 0 && balance !== BigInt(0)) {
            setStage(StageEnum.Deposit);
        }
    }, [balance, stage, setStage]);

    useEffect(() => {
        if (bidderBalance === undefined) return;
        if (stage === 1 && bidderBalance > BigInt(0)) {
            setStage(StageEnum.PlaceBid);
        }
    }, [bidderBalance, stage, setStage]);

    return (
        chain == null ? <SignIn></SignIn> :
            chain.id !== 4913 ? <SwitchNetwork /> :
                <VStack alignItems={"left"} minWidth={"400px"} maxWidth={"700px"} spacing={5}>
                    <CustomHeading header={"Bridge"} description={"Bridge your Ethereum to OEV Network."} isLoading={false}></CustomHeading>
                    <Text fontSize={"sm"}>You can add funds to your wallet by using the official OEV Network bridge.</Text>

                    <Flex p={2} width={"100%"} bgColor={COLORS.app} >
                        <Text fontSize={"md"} fontWeight={"bold"}>Ethereum Balance</Text>
                        <Spacer />
                        <Text fontWeight={"bold"} fontSize={"md"}>{parseETH(balance)} ETH</Text>
                    </Flex>
                    {
                        balance === BigInt(0) ?
                            <VStack p={4} width={"100%"} bgColor={COLORS.caution} alignItems={"left"} spacing={5}>
                                <Text fontSize={"md"} fontWeight={"bold"}>Add Funds</Text>
                                <Text fontSize={"sm"}>You have no funds to deposit. Please add funds to your wallet.</Text>
                                <Button
                                    size={"md"} colorScheme={"blue"} variant={"solid"}
                                    onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}>OEV Network Bridge
                                </Button>
                            </VStack>
                            :
                            <VStack width={"100%"} alignItems={"left"} spacing={5}>
                                <Button
                                    size={"md"} colorScheme={"blue"} variant={"solid"}
                                    onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}>OEV Network Bridge
                                </Button>
                            </VStack>
                    }
                </VStack>
    );
};

export default Bridge;