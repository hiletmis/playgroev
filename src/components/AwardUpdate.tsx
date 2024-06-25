import SignIn from '../custom/SignIn';
import { useAccount } from "wagmi";
import CustomHeading from "../custom/Heading";
import * as Description from "../helpers/descriptions";
import { useState } from "react";

import {
    VStack
} from "@chakra-ui/react";
import BidView from "../custom/BidView";
import { StageEnum } from '../types';

const AwardUpdate = () => {
    const { chain } = useAccount()
    const [help, setHelp] = useState(false);

    return (
        chain == null ? <SignIn></SignIn> :
            <VStack spacing={4} alignItems={"left"} >
                <CustomHeading header={Description.awardUpdateTitle} description={Description.awardUpdateDescription} isLoading={false} setHelp={setHelp} help={help} stage={StageEnum.AwardAndUpdate}></CustomHeading>
                <BidView></BidView>
            </VStack>
    );
};

export default AwardUpdate;