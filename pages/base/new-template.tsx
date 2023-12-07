import {
    Box, Button, Flex, Text, Input, Textarea,
    Select, HStack,
    VStack
} from "@chakra-ui/react";
import BaseSidebar from "../../components/BaseSideBar";
import { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";


let router;
export default function TemplatesPage() {
    const [contextData, setContextData] = useState({} as any);
    router = useRouter()

    return (
        <>


            <Flex direction={'row'}>
                <BaseSidebar />
                <MainContent contextData={contextData} />
                <OptionsPane contextData={contextData} setContextData={setContextData}/>
            </Flex>


        </>
    )
}

function MainContent({contextData}: {contextData: any}) {

    const [title, setTitle] = useState('')
    const [primer, setPrimer] = useState('')




    return <Flex
        direction="column"
        backgroundColor='gray.100'
        height={{ base: '100vh' }}
        width={{ base: '80%' }}
        alignItems={'center'}
        paddingTop={'50px'}

    >

        <VStack spacing={'40px'}>
            <Input
                width={'30rem'}
                borderStyle={'solid'}
                borderWidth={'1px'}
                borderColor={'black'}
                backgroundColor={'whiteAlpha.900'}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}


            />
            <Textarea
                borderStyle={'solid'}
                borderWidth={'1px'}
                borderColor={'black'}
                backgroundColor={'whiteAlpha.900'}
                height={'20rem'}
                onChange={(e) => {
                    setPrimer(e.target.value);
                }}

            />
            <Button
                backgroundColor="#1a6b0c"
                color={'white'}
                width={'100%'}
                onClick={() => {saveTemplate (title, primer, contextData)}}
            >Done</Button>

        </VStack>

    </Flex>
}

function OptionsPane({contextData, setContextData}: {contextData: any, setContextData: Function}) {
    const lastContextData = useRef(0);
    return <Flex
        color='whiteAlpha.900'
        height={{ lg: '100vh' }}
        backgroundColor="#1a6b0c"
        width={{ lg: '20%' }}
        justifyContent='center'

    >

        <Box marginTop={'40px'}
            paddingLeft={'10px'}
        >

            <Text>Context Data</Text>
            {
                Object.keys(contextData).map((key) => (
                    <HStack key={key} marginTop={'10px'}>


                        <Input
                            width={'50%'}
                            onChange={(e) => {
                                contextData[key]["name"] = e.target.value
                            }}

                        ></Input>

                        <Select placeholder='Type'

                            width={'50%'}
                            color={"black"}
                            onChange={(e) => {
                                contextData[key]["value"] = e.target.value
                            }}
                        >
                            <option value='option1'>PDF</option>
                            <option value='option2'>Text</option>
                            <option value='option3'>Web</option>
                        </Select>

                    </HStack>
                ))
                
               
            }

            <Button width={'100%'}
                height={'fit-content'}
                padding={'4px'}
                marginTop={'30px'}
                onClick={() => {
                    lastContextData.current++;
                    contextData[lastContextData.current] = {
                        name: "",
                        value: ""
                    } 
                    setContextData({...contextData})
                }}
            >Add</Button>

        </Box>

    </Flex>
}

const saveTemplate = async (title: string, primer: string, contextData: any) => {

    const result = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/agent/templates" as string, {
        title: title,
        primer: primer,
        context_data: contextData
    });

    if (result.status == 201)
        router.push('/base/templates');
}