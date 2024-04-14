import { VStack, ButtonGroup, Button, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../TextField";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AccountContext } from "../UserContext";

export default function Login() {
  const { setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required("Username required")
          .min(6, "Username is too short")
          .max(28, "Username is too long"),
        password: Yup.string()
          .required("Password required")
          .min(6, "Password is too short")
          .max(28, "Password is too long"),
      })}
      onSubmit={(values, actions) => {
        const vals = { ...values };
        actions.resetForm();
        fetch("http://localhost:4000/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vals),
        })
          .catch((err) => {
            return;
          })
          .then((res) => {
            if (!res || !res.ok || res.status >= 400) {
              return;
            }
            return res.json();
          })
          .then((data) => {
            if (!data) return;
            setUser({ ...data });
            if (data.status) {
              setError(data.status);
            } else if (data.loggedIn) {
              navigate("/home");
            }
          });
      }}
    >
      {(formik) => (
        <VStack
          as={Form}
          w={{ base: "90%", md: "500px" }}
          m="auto"
          justify="center"
          h="100vh"
          spacing="1.5rem"
        >
          <Heading>Log in</Heading>
          <TextField
            name="username"
            placeholder="Enter username"
            autoComplete="off"
            label="Username"
          ></TextField>
          <TextField
            name="password"
            placeholder="Enter password"
            autoComplete="off"
            label="Password"
            type="password"
          ></TextField>

          <Text as="p" color="red.500">
            {error}
          </Text>

          <ButtonGroup pt="1rem">
            <Button colorScheme="teal" type="submit">
              Log in
            </Button>
            <Button onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </ButtonGroup>
        </VStack>
      )}
    </Formik>
  );
}
