import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Tooltip, Text } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from "../config/ChatLogic"

import NotificationBadge, { Effect } from 'react-notification-badge'

const SideDrawer = () => {

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const history = useHistory();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const logoutHandler = () => {
        localStorage.removeItem("userinfo");
        history.push("/");
    };
    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: "5000",
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error occured.",
                description: error.message,
                status: "error",
                duration: "5000",
                isClosable: true,
                position: "bottom-left",
            });

        }
    }

    const accessChat = async (userId) => {
        console.log(userId);
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("/api/chat", { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: "5000",
                isClosable: true,
                position: "bottom-left",
            });

        }
    };


    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
                borderRadius={"lg"}

            >
                <Tooltip
                    label="Search User to chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fas fa-search"></i>
                        <Text fontSize="1xl" d={{ base: "none", md: "flex" }}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl">{user.name}</Text>
                <div>
                    <Menu p={1}>
                        <MenuButton>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontsize="1xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((n) => (
                                <MenuItem key={n._id}
                                    onClick={() => {
                                        setSelectedChat(n.chat);
                                        setNotification(notification.filter((notif) => n !== notif));
                                    }}>
                                    {n.chat.isGroupChat ? `New Message in ${n.chat.chatName}`
                                        : `New Message from ${getSender(user, n.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={logoutHandler}>Sign Out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer onClose={onClose} isOpen={isOpen} placement='left'>
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader borderBottomWidth={"1px"} >Search Users</DrawerHeader>
                        <DrawerBody>
                            <Box display="flex" pb={2}>
                                <Input
                                    placeholder='Search by user or email'
                                    mr={2}
                                    value={search}
                                    onChange={(ev) => setSearch(ev.target.value)}
                                />
                                <Button onClick={handleSearch}>Go</Button>
                            </Box>
                            {
                                loading ? (
                                    <ChatLoading />
                                ) : (
                                    searchResult?.map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => accessChat(user._id)}
                                        />
                                    ))
                                )
                            }
                            {loadingChat && <Spinner ml="auto" display="flex" />};
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </>
    )
}

export default SideDrawer;