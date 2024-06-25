import { Flex, Box, Spacer, Heading, VStack, Text } from '@chakra-ui/react';
import { CloseIcon, ChevronRightIcon } from '@chakra-ui/icons';
import * as Descriptions from '../helpers/descriptions';
import { HelpSection } from '../types';

const HelpView = ({ help, setHelp, stage }: any) => {
    return (
        help &&
        <VStack className={"backdrop"} onClick={() => setHelp(false)} >
            <VStack className={"modal"} p={4} alignItems={"left"}>
                <Flex width={"100%"} alignItems={"center"}>
                    <Heading size={"lg"}>{Descriptions.helpTitle(stage)}</Heading>
                    <Spacer />
                    <CloseIcon cursor={"pointer"} onClick={() => setHelp(false)} />
                </Flex>
                <Box bgColor={"yellow.400"} height={"3px"} />
                <VStack alignItems={"left"}>
                    {
                        Descriptions.helpText(stage).map((section: HelpSection, index: number) => {
                            return (
                                <VStack key={index} alignItems={"left"}>
                                    <Flex alignItems={"center"}>
                                        <ChevronRightIcon width={"20px"} height={"20px"} />
                                        <Text fontWeight={"bold"} fontSize={"lg"}>{section.title}</Text>
                                    </Flex>
                                    {
                                        section.content.map((content: string, index: number) => {
                                            return (
                                                <Text key={index} fontSize={"sm"}>{content}</Text>
                                            )
                                        })
                                    }
                                </VStack>
                            )
                        })
                    }
                </VStack>
            </VStack>
        </VStack>
    );
};

export default HelpView;
