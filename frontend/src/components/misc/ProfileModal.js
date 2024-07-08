import { ViewIcon } from "@chakra-ui/icons";
import {
    IconButton, Modal, useDisclosure, ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Image
} from "@chakra-ui/react";
import React from 'react'


const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? (<span onClick={onOpen}>{children}</span>) : (<IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />)
            }
            <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h="350px">
                    <ModalHeader display="flex" justifyContent="center">{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir={"column"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Image
                            borderRadius={"full"}
                            boxSize={"120px"}
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text fontSize="xl" fontFamily={"Lato"} justifyContent={"center"}>
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {/* <Button variant='ghost'>Secondary Action</Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal