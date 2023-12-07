import { Box, Button, Card, Center, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react"
import BaseSidebar from "../../components/BaseSideBar";

export default function NewAgentPage() {


    return (
        <>


            <Flex direction={'row'}>
                <BaseSidebar />
                <MainContent />
            </Flex>


        </>
    )
}

function MainContent() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenPublish, onOpen: onOpenPublish, onClose: onClosePublish } = useDisclosure();
    const TemplatesModalMemo = React.memo(TemplatesModal)
    const PublishModalMemo = React.memo(PublishModal)

    return <Flex
        direction="column"
        backgroundColor='gray.100'
        height={{ base: '100vh' }}
        width={{ base: '80%' }}
        paddingTop={{ base: '30px' }}

        alignItems={'center'}
    >

        {isOpen && <TemplatesModalMemo isOpen={isOpen} onClose={onClose} />}
        {isOpenPublish && <PublishModalMemo isOpen={isOpenPublish} onClose={onClosePublish} />}



        <Card

            marginTop={'30px'}
            direction='row'
            backgroundColor={'white'}
            height={{ base: '70%' }}
            padding={{ base: '20px' }}
            borderRadius={0}
            width={{ lg: '60rem' }}

        >
           <Box>
                <Button
                    onClick={() => {
                        onOpen();
                    }}

                >
                    Choose Template
                </Button>


                <Text>Template Name</Text>
                <p>
                Caused by:
    Syntax Error
        - wait compiling...
        - event compiled client and server successfully in 1097 ms (2307 modules)
        - wait compiling...
        - event compiled client and server successfully in 2.6s (2307 modules)
        Caused by:
    Syntax Error
- wait compiling...
- event compiled client and server successfully in 1097 ms (2307 modules)
- wait compiling...
- event compiled client and server successfully in 2.6s (2307 modules)
Caused by:
    Syntax Error
- wait compiling...
- event compiled client and server successfully in 1097 ms (2307 modules)
- wait compiling...
- event compiled client and server successfully in 2.6s (2307 modules)


                </p>

                <Box 
                width={'100%'}>
                    <HStack spacing={'50'} marginTop={'30px'}>
                        <Text>CV</Text>
                        <Button>
                            Upload File
                        </Button>
                    </HStack>
                </Box>
            </Box>


        </Card>

        <Center marginTop={'40px'}>
            <HStack>
                <Button>Save</Button>
                <Button onClick={onOpenPublish}>Publish</Button>
            </HStack>
        </Center>




    </Flex>
}

function TemplatesModal({
    isOpen, onClose
}: { isOpen: any, onClose: any }) {

    const [templates, setTemplates] = useState([] as any[])

    useEffect(() => {
        async function getTemplates() {
            const allTemplates: any[] = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/agent/templates").then((result) => result.data);
            setTemplates([...templates, ...allTemplates]);
        }

        getTemplates();

    }, [])


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

                    >Select Template</Text>
                </Center>
            </ModalHeader>
            <form onSubmit={() => alert("somebody")}>
                <ModalBody padding={5} textAlign={'left'}>
                    <VStack>
                        {
                            templates.map((template, key) => (
                                <Box key={key}
                                    cursor='pointer'
                                    onClick={() => {

                                    }}

                                >
                                    <Text key={key}>{template.title}</Text>
                                </Box>
                            ))
                        }
                    </VStack>



                </ModalBody>

            </form>
        </ModalContent>
    </Modal>
}

function PublishModal({
    isOpen, onClose
}: { isOpen: any, onClose: any }) {


    return <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
    >
        <ModalOverlay width={"100%"} />
        <ModalContent marginX={7}>


            <ModalBody>
                fdf
            </ModalBody>
            
        </ModalContent>
    </Modal>
}

