import SignIn from '../custom/SignIn';
import { useAccount } from "wagmi";
import CustomHeading from "../custom/Heading";
import * as Description from "../helpers/descriptions";

import {
    VStack
} from "@chakra-ui/react";
import BidView from "../custom/BidView";

const AwardUpdate = () => {
    const { chain } = useAccount()

    return (
        chain == null ? <SignIn></SignIn> :
            <VStack spacing={4} alignItems={"left"} >
                <CustomHeading header={Description.awardUpdateTitle} description={Description.awardUpdateDescription} isLoading={false}></CustomHeading>
                <BidView></BidView>
            </VStack>
    );
};

export default AwardUpdate;