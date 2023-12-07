import { Box, Button, Card, Center, Flex, FormControl, FormLabel, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import {useEffect, useState} from 'react';
import BaseSidebar from "../../../components/BaseSideBar"
import { useRouter } from "next/router";

export default function InterviewDetailsPage () {

    const router = useRouter();
    const {isReady} = router;

    const [interview, setInterview] = useState([] as []);

    useEffect(() => {

        async function confirmInterviewLink() {
            axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/interviews/" + router.query.slug)
            .then((result) => {
               setInterview(JSON.parse(result.data[0]["conversation"]))
            })
            .catch(() => {
                router.push("/")
            })

        }

        if (isReady) {
            console.log(router.query.slug)
            confirmInterviewLink();
        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady])


    return (
        <>

           
    <Flex direction={'row'}>
        <BaseSidebar />
        <MainContent data = {interview}/>
    </Flex>
        
        
        </>
    )
}

function MainContent ({data} : {data: []}) {
    const router = useRouter()

    return <Flex
        direction="row"
        backgroundColor='#F5F7FA'
        height={{ base: '100vh' }}
        width={{base: '100%'}}
        paddingTop={'20px'}
        overflowY={'auto'}
        paddingX={'40px'}
        
    >

        <Box backgroundColor={'white'} maxWidth={'70%'} borderRadius={'20px'}
        padding={'30px'} height={'fit-content'}
        
        >

           {    


                data.map((item, key) => (
                    <Box marginTop={'30px'} key={key}>
                    {item["role"] == "assistant" && <Text>Agent: {item["content"]}</Text>}
                    
                    {item["role"] == "user" && <Text>User: {item["content"]}</Text>}
                    
                </Box> 
                ))
            
           }
            
             
            

        </Box>
        
      


    </Flex>
}

