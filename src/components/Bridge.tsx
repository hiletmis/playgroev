
import { useContext, useEffect, useState } from 'react';
import { VStack, Flex, Text, Spacer } from '@chakra-ui/react';
import CustomHeading from '../custom/Heading';
import SignIn from '../custom/SignIn';
import { useAccount } from 'wagmi';
import SwitchNetwork from '../custom/SwitchNetwork';
import { OevContext } from '../OEVContext';
import { COLORS, parseETH } from '../helpers/utils';
import { StageEnum } from '../types';
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import { useReadContract } from 'wagmi';
import * as Descriptions from '../helpers/descriptions';
import ExecuteButton from '../custom/ExecuteButton';

const Bridge = () => {
    const { chain, address } = useAccount()
    const { balance, ethereumBalance, stage, setStage } = useContext(OevContext);

    const [help, setHelp] = useState(false);

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
                    <CustomHeading header={Descriptions.bridgeTitle} description={Descriptions.bridgeDescriptionLine1} isLoading={false} setHelp={setHelp} help={help} stage={StageEnum.Bridge}></CustomHeading>
                    <Text fontSize={"sm"}>{Descriptions.bridgeDescriptionLine2}</Text>

                    <Flex p={2} width={"100%"} bgColor={COLORS.app} >
                        <Text fontSize={"md"} fontWeight={"bold"}>{Descriptions.oevNetworkBalance}</Text>
                        <Spacer />
                        <Text fontWeight={"bold"} fontSize={"md"}>{parseETH(balance)} ETH</Text>
                    </Flex>
                    <Flex p={2} width={"100%"} bgColor={COLORS.app} >
                        <Text fontSize={"md"} fontWeight={"bold"}>{Descriptions.ethereumBalance}</Text>
                        <Spacer />
                        <Text fontWeight={"bold"} fontSize={"md"}>{parseETH(ethereumBalance)} ETH</Text>
                    </Flex>
                    {
                        balance === BigInt(0) ?
                            <VStack p={4} width={"100%"} bgColor={COLORS.caution} alignItems={"left"} spacing={5}>
                                <Text fontSize={"md"} fontWeight={"bold"}>{Descriptions.noBalanceTitle}</Text>
                                <Text fontSize={"sm"}>{Descriptions.noBalanceDescription}</Text>
                                <ExecuteButton text={Descriptions.bridgeButton} onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}></ExecuteButton>
                            </VStack>
                            :
                            <VStack width={"100%"} alignItems={"left"} spacing={5}>
                                <ExecuteButton text={Descriptions.bridgeButton} onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}></ExecuteButton>
                            </VStack>
                    }
                </VStack>
    );
};

export default Bridge;