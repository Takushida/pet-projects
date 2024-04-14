import { TabPanel, TabPanels, VStack, Text } from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { FriendContext, MessagesContext } from "./Home";
import ChatBox from "./ChatBox";

export default function Chat({ userid }) {
  const { friendList } = useContext(FriendContext);
  const { messages } = useContext(MessagesContext);
  const bottomDiv = useRef(null);
  useEffect(() => {
    bottomDiv.current?.scrollIntoView();
  });

  if (friendList.length > 0) {
    return (
      <VStack h="100%" justify="end">
        <TabPanels overflowY="scroll">
          {friendList.map((friend) => (
            <VStack
              flexDir="column-reverse"
              w="100%"
              as={TabPanel}
              key={`chat:${friend.username}`}
            >
              <div ref={bottomDiv} />
              {messages
                .filter(
                  (message) =>
                    message.to === friend.userid ||
                    message.from === friend.userid
                )
                .map((message, id) => (
                  <Text
                    m={
                      message.to === friend.userid
                        ? "1rem 0 0 auto !important"
                        : "1rem auto 0 0 !important"
                    }
                    maxW="50%"
                    key={`message:${friend.username}${id}`}
                    fontSize="lg"
                    bg={message.to === friend.userid ? "blue.200" : "gray.100"}
                    color="gray.800"
                    borderRadius="10px"
                    p="0.5rem 1rem"
                  >
                    {message.content}
                  </Text>
                ))}
            </VStack>
          ))}
        </TabPanels>
        <ChatBox userid={userid} />
      </VStack>
    );
  } else {
    return (
      <VStack justify="center" p="5rem" textAlign="center" fontSize="lg">
        <TabPanels>
          <TabPanel>
            <Text>No friends yet</Text>
          </TabPanel>
        </TabPanels>
      </VStack>
    );
  }
}
