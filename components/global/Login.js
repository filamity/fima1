import { useState } from "react";
import styles from "../../styles/global/Login.module.css";
import {
  TextField,
  Button,
  FormGroup,
  Card,
  Link,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Box from "./Box";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { login, register } = useAuth();
  const [hasAccount, setHasAccount] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    register(firstName, lastName, username, password, role);
  };

  return (
    <Box title={hasAccount ? "Login" : "Register"} className={styles.box}>
      <Card className={styles.card}>
        <form onSubmit={hasAccount ? handleLogin : handleRegister}>
          <FormGroup>
            <TextField
              label="Username"
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <section className="buffer-20"></section>
            <TextField
              label="Password"
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <section className="buffer-20"></section>
            {!hasAccount && (
              <>
                <TextField
                  label="First Name"
                  variant="standard"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <section className="buffer-20"></section>
                <TextField
                  label="Last Name"
                  variant="standard"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <section className="buffer-20"></section>
                <ToggleButtonGroup
                  value={role}
                  exclusive
                  onChange={(e, v) => setRole(v)}
                >
                  <ToggleButton value="student">Student</ToggleButton>
                  <ToggleButton value="teacher">Teacher</ToggleButton>
                </ToggleButtonGroup>
                <section className="buffer-20"></section>
              </>
            )}
            <Button variant="contained" color="primary" type="submit">
              {hasAccount ? "Login" : "Register"}
            </Button>
          </FormGroup>
          <section className="buffer-10"></section>
          <Link
            href="#"
            variant="body2"
            onClick={() => setHasAccount((prev) => !prev)}
          >
            {hasAccount ? "or Register" : "or Login"}
          </Link>
        </form>
      </Card>
    </Box>
  );
};

export default Login;
