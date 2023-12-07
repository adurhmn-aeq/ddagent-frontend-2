import { Flex, Box, Text } from "@chakra-ui/react";
import { MdHouse, MdOutlet, MdSource, MdTableRows } from "react-icons/md";
import { SideBarItem } from "./SideBarItem";

export default function BaseSideBar() {
    return <Flex
        color='whiteAlpha.900'
        height={{ lg: '100vh' }}
        backgroundColor="#ffff"
        width={{ base: '20%' }}
        justifyContent='center'
        borderRightColor={'#E6EFF5'}
        borderRightWidth={'2px'}

    >

        <Box marginTop={'40px'}>
           <SideBarItem text="Home" link="/" icon = {<MdHouse/>} />
           <SideBarItem text="Interviews" link="/base/interviews" icon = {<MdSource/>} />
           <SideBarItem text="Agents" link="/base/agents" icon = {<MdOutlet/>} />
           <SideBarItem text="Templates" link="/base/templates" icon = {<MdSource/>} />

        </Box>




    </Flex>
}