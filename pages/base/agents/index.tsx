import { Box, Button, Card, Center, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import {useEffect, useState} from 'react';
import BaseSidebar from "../../../components/BaseSideBar";
import { useRouter } from "next/router";

export default function AgentsPage () {

    const [agents, setAgents] = useState([] as any[]);


    useEffect(() => {
        async function ageAgents () {
          const allAgents: any[] =  await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+"/agent/").then((result) => result.data );
            setAgents([...agents, ...allAgents]);
        }
         
        ageAgents();

    }, [])


    return (
        <>

           
    <Flex direction={'row'}>
        <BaseSidebar />
        <MainContent  data={agents}/>
    </Flex>
        
        
        </>
    )
}

function MainContent ({data}: {data: any[]}) {
    const router = useRouter()

    const { isOpen, onOpen, onClose } = useDisclosure();
    const BotCreationModalMemo = React.memo(BotCreationModal)

    return <Flex
        direction="column"
        backgroundColor='#F5F7FA'
        height={{ base: '100vh' }}
        width={{base: '100%'}}

        alignItems={'center'}
    >

        <BotCreationModalMemo isOpen={isOpen} onClose={onClose} />

        
        <Flex direction={"row-reverse"}
            width={'100%'}
            height={'80px'}
            backgroundColor={'#fff'}
            alignItems={'center'}
            paddingRight={'30px'}
        >
            <Button backgroundColor={'#1a6b0c'}
            color="white"
                rounded={'5px'}
                onClick={() => {router.push('/base/agents/new')}}
            >New Agent</Button>

        </Flex>
        <Box marginTop={{ base: '20px' }}>
        <Card
                    
                    marginTop={'30px'}
                    direction='row'
                    backgroundColor={'white'}                
                    alignItems='center'
                    padding={{ base: '20px' }}
                    borderRadius={20}
                    width={{ lg: '60rem' }}
                >
                     <VStack>
                    <HStack spacing={'100px'}
                    fontWeight={500} 
                    fontSize={'16px'}
                    
                    color="#718EBF">
                      <Text>
                        Agent Name
                        </Text>  
                        <Text>
                        Status
                        </Text>  
                    </HStack>
            {
               
                data.map((agent, key) => (


                    <Box key={key}>
                    
                    <Text key={key}
                    color="#505887"
                    >
                       {agent.name}
                    </Text>
                    </Box>
    
               
                ))

                
                
                
            }
            </VStack>
             </Card> 

            {
                data.length == 0 && "No Agents Yet. Create one."
                // and also fully loaded. (create your first template)
            }

           
        </Box>



    </Flex>
}

function BotCreationModal({
    isOpen, onClose
}: { isOpen: any, onClose: any }) {

    function createBot() {
        // axios.post()
    }

    return <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
    >
        <ModalOverlay width={"100%"} />
        <ModalContent marginX={7}>

            <ModalCloseButton />
            <ModalHeader>
                <Center>
                    <Text
                        fontWeight={'bold'}

                    >New Agent</Text>
                </Center>
            </ModalHeader>
            <form onSubmit={() => alert("somebody")}>
                <ModalBody padding={5}>


                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder='Give your agent a name' type="text" marginTop={1}
                            onChange={(event) => {

                            }

                            }></Input>
                    </FormControl>

                    <FormControl marginTop={5}>
                        <FormLabel>Description</FormLabel>
                        <Input placeholder='' type="text" marginTop={1}
                            onChange={(event) => {

                            }

                            }></Input>
                    </FormControl>

                </ModalBody>
                <ModalFooter>


                    <Button
                        colorScheme={'blue'}
                        isLoading={false}
                        loadingText={'Creating'}
                        type="submit"


                    >Create</Button>
                </ModalFooter>
            </form>
        </ModalContent>
    </Modal>
}

