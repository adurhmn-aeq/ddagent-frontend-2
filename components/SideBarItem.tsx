import { Box, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";


export function SideBarItem(props: { text: string, link: string, icon: ReactNode }) {


    return <>

        <Box marginTop={'20px'}
            cursor='pointer'
            color="#505887"

        >   <HStack>

                {props.icon}
                <Link href={props.link}>
                    {props.text}
                </Link>
            </HStack>

        </Box>
    </>

}

