import { Box, Button, Card, Center, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import {useEffect, useState} from 'react';
import BaseSidebar from "../../components/BaseSideBar";

export default function TemplatesPage () {

    const [templates, setTemplates] = useState([] as any[]);


    useEffect(() => {
        async function getTemplates () {
          const allTemplates: any[] =  await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+"/agent/templates").then((result) => result.data );
            setTemplates([...templates, ...allTemplates]);
        }
         
        getTemplates();

    }, [])


    return (
        <>

           
    <Flex direction={'row'}>
        <BaseSidebar />
        <MainContent  templates={templates}/>
    </Flex>
        
        
        </>
    )
}

function MainContent ({templates}: {templates: any[]}) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const BotCreationModalMemo = React.memo(BotCreationModal)

    return <Flex
        direction="column"
        backgroundColor='gray.100'
        height={{ base: '100vh' }}
        width={{base: '80%'}}

        alignItems={'center'}
    >

        <BotCreationModalMemo isOpen={isOpen} onClose={onClose} />

        
        <Flex direction={"row-reverse"}
            width={'90%'}
            marginY={'20px'}
        >
            <Button colorScheme={'blue'}
                rounded={'5px'}
                onClick={onOpen}
            >New Template</Button>

        </Flex>
        <Box marginTop={{ base: '20px' }}>

            {
                templates.map((title, key) => (
                    <Card
                    key={key}
                    marginTop={'30px'}
                    direction='row'
                    backgroundColor={'white'}
                    height={{ base: '40px' }}
                    alignItems='center'
                    padding={{ base: '20px' }}
                    borderRadius={0}
                    width={{ lg: '60rem' }}
                >
                    <Text>
                       {title.title}
                    </Text>
    
                </Card> 
                ))

                

                
            }

            {
                templates.length == 0 && "hello"
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

