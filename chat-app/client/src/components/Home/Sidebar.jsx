import {
  HStack,
  VStack,
  Heading,
  Button,
  Divider,
  TabList,
  Text,
  Tab,
  Circle,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { FriendContext } from "./Home";
import AddFriendModal from "./AddFriendModal";

export default function Sidebar() {
  const { friendList } = useContext(FriendContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <VStack py="1.4rem">
        <HStack justify="space-evenly" w="100%">
          <Heading size="lg">Add Friend</Heading>
          <Button onClick={onOpen}>
            <AddIcon />
          </Button>
        </HStack>
        <Divider my="1.4rem" />
        <VStack as={TabList}>
          {friendList.map((friend, id) => {
            return (
              <HStack as={Tab} key={`friend:${friend}`} px={5}>
                <Circle
                  bg={friend.connected ? "green.500" : "gray.500"}
                  w="10px"
                  h="10px"
                />
                <Text>{friend.username}</Text>
              </HStack>
            );
          })}
        </VStack>
      </VStack>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
