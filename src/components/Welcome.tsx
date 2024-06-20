import { VStack, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

import Bridge from './Bridge';
import Deposit from './Deposit';
import PlaceBid from './PlaceBid';
import { useContext, useEffect } from 'react';
import { OevContext } from '../OEVContext';
import AwardUpdate from './AwardUpdate';
import Report from './Report';
import { StageEnum } from '../types';

const Welcome = () => {

    const { stage } = useContext(OevContext);

    useEffect(() => {
        console.log(stage);
    }, [stage]);

    return (
        <VStack
            p={10}
            bgColor={'white'}
            boxShadow="md"
            spacing={5}
            width={'95vw'}
            maxWidth={'1100px'}
            alignItems={'left'}
            justifyItems={'center'}
        >
            <Tabs>
                <TabList>
                    <Tab isDisabled={stage < StageEnum.SignIn}>Bridge</Tab>
                    <Tab isDisabled={stage <= StageEnum.Bridge}>Deposit</Tab>
                    <Tab isDisabled={stage <= StageEnum.Deposit}>Place Bid</Tab>
                    <Tab isDisabled={stage <= StageEnum.PlaceBid}>Award and Update</Tab>
                    <Tab isDisabled={stage !== StageEnum.Report}>Report</Tab>
                </TabList>
                <TabPanels>

                    <TabPanel>
                        <Bridge />
                    </TabPanel>
                    <TabPanel>
                        <Deposit />
                    </TabPanel>
                    <TabPanel>
                        <PlaceBid />
                    </TabPanel>
                    <TabPanel>
                        <AwardUpdate />
                    </TabPanel>
                    <TabPanel>
                        <Report />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
};

export default Welcome;
