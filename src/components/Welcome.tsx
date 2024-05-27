import { VStack, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import Instructions from './Instructions';
import Bridge from './Bridge';

const Welcome = () => {
    return (
        <VStack
            p={10}
            bgColor={'white'}
            borderRadius={'sm'}
            boxShadow="md"
            spacing={5}
            width={'95vw'}
            maxWidth={'1100px'}
            alignItems={'left'}
            justifyItems={'center'}
            overflow={'scroll'}
        >
            <Tabs>
                <TabList>
                    <Tab>Instructions</Tab>
                    <Tab>Deposit Collateral</Tab>
                    <Tab>Place a Bid</Tab>
                    <Tab>Awarding</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Instructions />
                    </TabPanel>
                    <TabPanel>
                        <Bridge />
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
