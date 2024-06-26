
import { useContext, useEffect, useState } from 'react';
import { VStack, Flex, Text, Spacer } from '@chakra-ui/react';
import CustomHeading from '../custom/Heading';
import ExecuteButton from '../custom/ExecuteButton';
import AddCollateral from '../custom/AddCollateral';
import SignIn from '../custom/SignIn';
import { useAccount, useWriteContract, useSimulateContract, useReadContract } from 'wagmi';
import SwitchNetwork from '../custom/SwitchNetwork';
import { OevContext } from '../OEVContext';
import { COLORS, parseETH, trimHash } from '../helpers/utils';
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import { parseEther } from 'ethers';
import { ViewIcon } from '@chakra-ui/icons';
import { StageEnum } from '../types';
import * as Descriptions from '../helpers/descriptions';

const Bridge = () => {
    const { chain, address } = useAccount()
    const { balance, stage, setStage } = useContext(OevContext);

    const [ethAmount, setEthAmount] = useState("");
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

    const { writeContract, isPending, data: hash, reset } = useWriteContract()

    //@ts-ignore
    const { data: depositForBidderData } = useSimulateContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chain ? chain.id : 4913,
        functionName: 'depositForBidder',
        args: [address as `0x${string}`],
        value: ethAmount === "" ? BigInt(0) : parseEther(ethAmount),
        query: {
            enabled: ethAmount !== "0" && ethAmount !== "",
        }
    })

    async function depositForBidder() {
        //@ts-ignore
        writeContract(depositForBidderData?.request, {
            onError: (error: any) => {
                reset();
            },
            onSuccess: () => {

            }
        });
    }

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
                    <CustomHeading header={Descriptions.depositCollateralTitle} description={Descriptions.depositCollateralDescription} isLoading={isPending} setHelp={setHelp} help={help} stage={StageEnum.Deposit}></CustomHeading>
                    <VStack alignItems={"left"} spacing={5}>
                        <AddCollateral tokenAmount={ethAmount} setTokenAmount={setEthAmount} tokenBalance={parseETH(balance)} ></AddCollateral>
                        <Flex p={2} width={"100%"} bgColor={COLORS.app} >
                            <Text fontSize={"md"} fontWeight={"bold"}>{Descriptions.collateralBalance}</Text>
                            <Spacer />
                            <Text fontWeight={"bold"} fontSize={"md"}>{parseETH(bidderBalance)} ETH</Text>
                        </Flex>
                        {
                            hash &&
                            <Flex p={2} gap={2} width={"100%"} bgColor={COLORS.app} >
                                <Text fontSize={"md"} fontWeight={"bold"}>Transaction</Text>
                                <Spacer />
                                <Text fontWeight={"bold"} fontSize={"md"}>{trimHash(hash)}</Text>
                                <Text fontSize={"md"} fontWeight={"bold"}>
                                    <a href={`https://oev-network.explorer.caldera.dev/tx/${hash}`} target="_blank" rel="noopener noreferrer">
                                        <ViewIcon color={"blue.500"}></ViewIcon>
                                    </a>
                                </Text>
                            </Flex>
                        }
                        <ExecuteButton
                            text={Descriptions.depositCollateralButton}
                            isDisabled={ethAmount === "0" || ethAmount === "" || parseFloat(parseETH(balance)) < parseFloat(ethAmount)}
                            onClick={() => depositForBidder()}>
                        </ExecuteButton>
                    </VStack>

                </VStack>
    );
};

export default Bridge;