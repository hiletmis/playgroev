import { Text, Box, Flex, Spacer, VStack, Image } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';

const Hero = (props: any) => {
    const { title, text, setText, margin = 0, color = "white", bgColor = COLORS.main } = props;

    const paste = () => {
        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(text => { setText(text) }).catch(err => { console.error('Failed to read clipboard contents: ', err) });
        } else {
            alert("Clipboard API not available");
        }
    }

    return (
        <VStack direction="row" align="left" m={margin}>
            <Text fontWeight={"bold"} fontSize={"md"}>{title}</Text>
            <Box p={2} width={"100%"} borderRadius={"10"} bgColor={bgColor} alignItems={"left"}>
                <Flex alignItems={"center"}>
                    <Text noOfLines={1} width={"100%"} color={color} fontSize={"md"}>{text}</Text>
                    <Spacer />
                    <Image cursor={"pointer"} marginLeft={"2"} onClick={paste} src={`./paste.svg`} width={"24px"} height={"24px"} />
                </Flex>
            </Box>
        </VStack>
    );
};

export default Hero;


