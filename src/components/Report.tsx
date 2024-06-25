import SignIn from '../custom/SignIn';
import { useAccount } from "wagmi";
import CustomHeading from "../custom/Heading";
import { useState } from "react";

import {
    VStack
} from "@chakra-ui/react";
import ReportFullfillmentView from "../custom/ReportFullfillmentView";

const Report = () => {
    const { chain } = useAccount()

    const [help, setHelp] = useState(false);

    return (
        chain == null ? <SignIn></SignIn> :
            <VStack spacing={4} alignItems={"left"} >
                <CustomHeading header={"Report Fullfillment"} description={"dAPI has been updated. Please report fullfillment."} isLoading={false} setHelp={setHelp} help={help}></CustomHeading>
                <ReportFullfillmentView></ReportFullfillmentView>
            </VStack>
    );
};

export default Report;