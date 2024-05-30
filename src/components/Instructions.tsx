
import { VStack, Flex, Text } from '@chakra-ui/react';

const Instructions = () => {
    return (
        <Flex width={"100%"} height={"100%"} borderRadius={"10"} alignItems={"left"}>
            <VStack alignItems={"left"} spacing={"3"}>
                <Text fontSize={"md"}>Start by clicking the "Deposit Collateral" button. You will be asked to bridge your Ethereum to OEV Network. After the bridging is completed, you will be able to place bids on data feeds. Usually it takes 5-7 minutes before deposit is confirmed.</Text>
                <Text fontSize={"md"}>Making deposit will allow you to place bids on all available chains and available data feeds.</Text>
                <Text fontSize={"md"}>After depositing collateral, you can place bids on data feeds. Select from available data feeds, enter your bid conditions and click the "Bid" button to place a bid. You will be asked to sign a message to place a bid. After the transaction is confirmed, you will be able to check your bid status.</Text>

                <Text fontSize={"md"}>In case of a won bid, you will be able to update the data feed. You can update the data feed by clicking the "Update Data Feed" button. You will be asked to sign a message to update the data feed. After the transaction is confirmed, you will be able to check your bid status.</Text>
                <Text fontSize={"md"}>Not updating the data feed in time will result in slashing your bid reserved funds.</Text>
            </VStack>
        </Flex>
    );
};

export default Instructions;