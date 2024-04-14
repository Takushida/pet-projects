import { HStack, Input, Button, Text } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import socket from "../../socket";
import { useContext } from "react";
import { MessagesContext } from "./Home";

export default function ChatBox({ userid }) {
  const { messages, setMessages } = useContext(MessagesContext);
  return (
    <Formik
      initialValues={{ message: "" }}
      validationSchema={Yup.object({
        message: Yup.string().min(1).max(255),
      })}
      onSubmit={(values, actions) => {
        const message = { from: null, to: userid, content: values.message };
        socket.emit("dm", message);
        setMessages((prevMessages) => [message, ...prevMessages]);
        actions.resetForm();
      }}
    >
      <>
        {messages.length === 0 ? (
          <Text
            mb="50%"
            fontSize="lg"
            bg="blue.800"
            px="2rem"
            py="1.4rem"
            borderRadius="8"
          >
            No messages yet
          </Text>
        ) : (
          ""
        )}
        <HStack as={Form} w="100%" pb="1.4rem" px="1.4rem">
          <Input
            as={Field}
            name="message"
            placeholder="Type message..."
            size="lg"
            autoComplete="off"
          />
          <Button type="submit" size="lg" colorScheme="teal">
            Send
          </Button>
        </HStack>
      </>
    </Formik>
  );
}
