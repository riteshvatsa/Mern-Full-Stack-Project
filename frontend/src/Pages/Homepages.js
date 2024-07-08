import { React, useEffect } from 'react'
import { Container, Box, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useHistory } from "react-router-dom"

const Homepage = () => {

    const history = useHistory();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userinfo"));

        if (user) {
            history.push("/chats");
        }
    }, [history]);

    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent="center"
                padding={3}
                bg={"white"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize='4xl' color={"black"} >
                    Web Chat
                </Text>
            </Box>
            <Box bg={"white"} w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"}>
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width={"50%"}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
};

export default Homepage;