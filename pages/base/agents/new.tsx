import {
    Box, Button, Flex, Text, Input, Textarea,
    Select, HStack,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    FormLabel,
    FormControl
} from "@chakra-ui/react";
import BaseSidebar from "../../../components/BaseSideBar";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { Link } from "@chakra-ui/next-js";


let router;
export default function NewAgentPage() {
    const [contextData, setContextData] = useState({} as any);
    router = useRouter()

    return (
        <>


            <Flex direction={'row'}>
                <BaseSidebar />
                <MainContent contextData={contextData} />
            </Flex>


        </>
    )
}

function MainContent({contextData}: {contextData: any}) {

    const [name, setName] = useState('')
    const [prompt, setPrompt] = useState('')
    const [link, setLink] = useState('')
    const {isOpen, onOpen, onClose} = useDisclosure()
    const PublishModalMemo = React.memo(PublishModal)


    function openModal(link: string ) {
        
    }

    

    return <Flex
        direction="column"
        backgroundColor='gray.100'
        height={{ base: '100vh' }}
        width={{ base: '100%' }}
        alignItems={'center'}
        paddingTop={'50px'}

    >
        <PublishModalMemo isOpen={isOpen} onClose={onClose} link={link}/>

        <VStack spacing={'30px'} width={'70%'}>
            <FormControl>
            <FormLabel>Agent Name</FormLabel>
            <Input
                
                borderStyle={'solid'}
                borderWidth={'1px'}
                borderColor={'black'}
                backgroundColor={'whiteAlpha.900'}
                onChange={(e) => {
                    setName(e.target.value);
                }}


            />
            </FormControl>
                <FormControl>
                <FormLabel>Prompt</FormLabel>
                <Textarea
                    borderStyle={'solid'}
                    borderWidth={'1px'}
                    borderColor={'black'}
                    backgroundColor={'whiteAlpha.900'}
                    height={'20rem'}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}

                />
                </FormControl>
           
            <HStack>
            
            <Button
                backgroundColor="#1a6b0c"
                color={'white'}
               
                onClick={() => {}}
            >Save</Button>
            <Button
                backgroundColor="#1a6b0c"
                color={'white'}
               
                onClick={() => {createAgent (name, prompt, onOpen, setLink)}}
            >Publish</Button>
            </HStack>

        </VStack>

    </Flex>
}

function PublishModal({
    isOpen, onClose, link
}: { isOpen: any, onClose: () => void, link: string}) {



    const router = useRouter()
    return <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
        
    >
        <ModalOverlay width={"100%"} />
        <ModalContent marginX={7} h={'50%'}>


            <ModalBody>
                <VStack marginTop={'20%'}>
                    <MdCheck size={'100px'} color="green"/>
                    <Text>This agent is now public and can be accessed from</Text>
                    <HStack><Link href={process.env.BASE_URL+"/base/interview/"+link}
                    color={'green'}
                    
                    >{process.env.BASE_URL}/base/interview/{link}</Link>
                    <MdContentCopy/>
                    </HStack>
                    
                    
                </VStack>
            </ModalBody>
            
        </ModalContent>
    </Modal>
}






const createAgent = async (title: string, primer: string, onOpen: Function, setLink: Function) => {

    const result = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/agent" as string, {
        name: title,
        prompt: primer,
        data: ''
    });

    if (result.status == 201) {
        console.log(result.data)
        setLink(result.data.link)
        onOpen()
    }
        
}