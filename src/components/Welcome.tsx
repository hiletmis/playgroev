import { VStack, Flex, Text, Box } from '@chakra-ui/react';

import Bridge from './Bridge';
import Deposit from './Deposit';
import PlaceBid from './PlaceBid';
import { useContext } from 'react';
import { OevContext } from '../OEVContext';
import AwardUpdate from './AwardUpdate';
import Report from './Report';
import { StageEnum } from '../types';

const Welcome = () => {

    const { stage, setStage, tab, setTab } = useContext(OevContext);

    const TabButton = ({ state, caption, isDisabled = false }: any) => {
        const isSelected = tab === state;
        const getColor = () => {
            if (isSelected) {
                return 'blue.300';
            }
            if (isDisabled) {
                return 'gray.100';
            }
            return 'blue.100';
        }

        const getTextColor = () => {
            if (isSelected) {
                return 'white';
            }
            if (isDisabled) {
                return 'gray.300';
            }
            return 'black';
        }

        function checkSetTab(state: number) {
            if (isDisabled) return

            if (stage > StageEnum.PlaceBid && state !== stage) {
                if (window.confirm("Do you really want to leave, you may lose your progress?")) {
                    setStage(state)
                    setTab(state)
                }
            } else {
                setTab(state)
            }
        }

        return (
            <VStack onClick={() => checkSetTab(state)} cursor={'pointer'} p={2} bgColor={getColor()}>
                <Text color={getTextColor()} fontWeight={isSelected ? "bold" : "regular"} fontSize={'md'}>{caption}</Text>
            </VStack>
        );
    };


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
            <VStack alignItems={'left'} width={"100%"} spacing={0}>
                <Flex gap={2}>
                    <TabButton isDisabled={stage < StageEnum.SignIn} caption={'Bridge'} state={0} />
                    <TabButton isDisabled={stage <= StageEnum.Bridge} caption={'Deposit'} state={1} />
                    <TabButton isDisabled={stage <= StageEnum.Deposit} caption={'Place Bid'} state={2} />
                    <TabButton isDisabled={stage <= StageEnum.PlaceBid} caption={'Award and Update'} state={3} />
                    <TabButton isDisabled={stage !== StageEnum.Report} caption={'Report'} state={4} />
                </Flex>
                <Box bgColor={"blue.300"} height={"5px"} />

            </VStack>

            {
                tab === 0 && <Bridge />
            }
            {
                tab === 1 && <Deposit />
            }
            {
                tab === 2 && <PlaceBid />
            }
            {
                tab === 3 && <AwardUpdate />
            }
            {
                tab === 4 && <Report />
            }
        </VStack>
    );
};

export default Welcome;
