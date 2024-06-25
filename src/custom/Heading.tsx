import { Text, Heading, Flex, Spacer, VStack, Image } from '@chakra-ui/react';
import { ColorRing } from 'react-loader-spinner';
import HelpView from './HelpView';

const CustomHeading = (props: any) => {
    const { header, description, isLoading } = props;
    return (
        <VStack maxW={"700px"} borderWidth="px" flex="1" alignItems={"left"}>
            <Flex alignItems={"center"}>
                <Heading size={"lg"}>{header}</Heading>
                <Spacer />
                <ColorRing height="30px" width="30px" ariaLabel="loading" visible={isLoading} />
                {
                    props.setHelp &&
                    <Image src={'./help.svg'} width={"30px"} height={"30px"} cursor={"pointer"} onClick={() => { props.setHelp(!props.help) }} />
                }
            </Flex>
            <Text fontSize={"sm"}>{description}</Text>
            {
                props.setHelp &&
                <HelpView help={props.help} setHelp={props.setHelp} stage={props.stage}></HelpView>
            }
        </VStack>
    );
};

export default CustomHeading;


