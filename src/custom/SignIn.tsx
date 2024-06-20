import { VStack, Flex, Spacer, Image } from '@chakra-ui/react';
import CustomHeading from './Heading';
import { useContext } from 'react';
import { OevContext } from '../OEVContext';
import { StageEnum } from '../types';

const SignIn = () => {
    const { setStage } = useContext(OevContext);

    setStage(StageEnum.SignIn);

    return (
        <VStack spacing={4} alignItems={"left"} >
            <Flex>
                <CustomHeading header={"Connect Wallet"} description={"Connect your wallet to continue."} isLoading={false}></CustomHeading>

                <Spacer />
                <Image src={`./caution.svg`} width={"30px"} height={"30px"} />
            </Flex>
        </VStack>
    );
};

export default SignIn;