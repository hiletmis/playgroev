import { Box, VStack, Flex, Spacer, Text } from '@chakra-ui/react';
import * as Utils from '../helpers/utils';
import InfoRow from './InfoRow';
import { BidInfo } from '../types';
import DApiRow from './DApiRow';

const BidView = ({ bids }: any) => {

    const setDapi = (dApi: any) => {
        console.log(dApi);
    }

    return (
        <VStack width={"100%"} alignItems={"left"} >
            <Flex>
                <Text fontWeight={"bold"} fontSize={"md"}>Bids</Text>
                <Spacer />
            </Flex>
            {
                bids.map((bid: BidInfo, index: number) => {
                    return (
                        <Box key={index} width={"100%"} p={1} bgColor={"blue.100"}>
                            <DApiRow dApi={bid.dApi} setDapi={setDapi}></DApiRow>
                            <InfoRow header={"Bid ID"} text={bid.bidId}></InfoRow>
                            <InfoRow header={"Transaction Hash"} text={Utils.trimHash(bid.tx)} link={Utils.transactionLink(bid.explorer, bid.tx)}></InfoRow>
                        </Box>
                    )
                })
            }
        </VStack>
    );
};

export default BidView;


