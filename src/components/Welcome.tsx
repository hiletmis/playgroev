import { VStack, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import Instructions from './Instructions';
import Bridge from './Bridge';
import PlaceBid from './PlaceBid';

const Welcome = () => {
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
                    <Tab>Instructions</Tab>
                    <Tab>Deposit</Tab>
                    <Tab>Bid</Tab>
                    <Tab>Update</Tab>
                    <Tab>Report</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Instructions />
                    </TabPanel>
                    <TabPanel>
                        <Bridge />
                    </TabPanel>
                    <TabPanel>
                        <PlaceBid />
                    </TabPanel>
                    <TabPanel>

                    </TabPanel>
                    <TabPanel>

                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
};

export default Welcome;
