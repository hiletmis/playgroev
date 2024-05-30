import { useEffect, useState } from "react";
import { Flex, VStack } from "@chakra-ui/react";
import { COLORS, getDapis, getChains } from '../helpers/utils';
import DApiRow from "./DApiRow";
import ChainRow from "./ChainRow";
import { SearchBar } from "./SearchBar";

const DataFeedList = (props: any) => {
    const { dApi, setDapi, selectedChain, setSelectedChain } = props;
    const [keyword, setKeyword] = useState("");

    const [isDApiListVisible, setIsDApiListVisible] = useState(false);
    const [isChainListVisible, setIsChainListVisible] = useState(false);

    useEffect(() => {
        setIsDApiListVisible(false);
        setIsChainListVisible(false);
    }, [dApi, selectedChain]);

    useEffect(() => {
        setKeyword("");
        if (!isDApiListVisible) return
        setIsChainListVisible(false);
    }, [isDApiListVisible]);

    useEffect(() => {
        setKeyword("");
        if (!isChainListVisible) return
        setIsDApiListVisible(false);
    }, [isChainListVisible]);

    return (
        <VStack width={"100%"} alignItems={"left"} spacing={0}>
            <Flex width={"100%"} justifyContent={"space-between"} gap={2}>
                <ChainRow selectedChain={selectedChain} setSelectedChain={setSelectedChain} isHeader={true} isOpen={isChainListVisible} onClick={() => { setIsChainListVisible(!isChainListVisible) }}></ChainRow>
                <DApiRow dApi={dApi} setDapi={setDapi} isHeader={true} isOpen={isDApiListVisible} onClick={() => { setIsDApiListVisible(!isDApiListVisible) }}></DApiRow>
            </Flex>

            {
                isDApiListVisible &&
                <VStack width={"100%"} p={5} maxHeight={"350px"} bgColor={"blue.400"} overflow={"scroll"} spacing={3} >
                    <SearchBar stateChanger={setKeyword}></SearchBar>

                    {
                        getDapis().filter((dApi) => { return dApi.name.toLowerCase().includes(keyword.toLowerCase()) }).map((dApi, index) => {
                            return (
                                <DApiRow key={index} dApi={dApi} setDapi={setDapi}></DApiRow>
                            )
                        })
                    }
                </VStack>
            }

            {
                isChainListVisible &&
                <VStack width={"100%"} p={5} maxHeight={"350px"} bgColor={"blue.400"} overflow={"scroll"} spacing={3}>
                    <SearchBar stateChanger={setKeyword}></SearchBar>

                    {
                        getChains().filter((chain) => { return chain.name.toLowerCase().includes(keyword.toLowerCase()) }).map((chain, index) => {
                            return (
                                <ChainRow key={index} selectedChain={chain} setSelectedChain={setSelectedChain}></ChainRow>
                            )
                        })
                    }
                </VStack>
            }

        </VStack>
    )
};

export default DataFeedList;