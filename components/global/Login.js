import { useEffect, useState } from "react";
import styles from "../../styles/global/Login.module.css";
import {
  TextField,
  Button,
  FormGroup,
  Card,
  Link,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import Box from "./Box";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { firestorage } from "../../utils/firebase";
import Compressor from "compressorjs";

const Login = () => {
  const { currentUser, login, register } = useAuth();
  const [hasAccount, setHasAccount] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");
  const [file, setFile] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const types = ["image/png", "image/jpeg"];

  useEffect(() => {
    setError("");
    return () => setError("");
  }, [firstName, lastName, username, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    let response = login(username, password);
    response.then((err) => {
      setError(err.message);
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    let response = register(
      firstName,
      lastName,
      username,
      password,
      role,
      file
    );
    response.then((err) => {
      setError(err.message);
    });
  };

  const handleUploadAvatar = (file) => {
    if (!file) return;
    if (!types.includes(file.type)) setError("Invalid file type");
    return new Promise((resolve) => {
      const fileName = uuidv4();
      firestorage
        .ref(`/avatars/${fileName}`)
        .put(file)
        .then(async () => {
          const downloadURL = await firestorage
            .ref(`/avatars/${fileName}`)
            .getDownloadURL();
          resolve({ success: true, data: { url: downloadURL } });
        });
    });
  };

  return (
    <Box title={hasAccount ? "Login" : "Register"} className={styles.box}>
      <Card className={styles.card}>
        <form onSubmit={hasAccount ? handleLogin : handleRegister}>
          <FormGroup>
            {!hasAccount && (
              <label className={styles.avatarupload}>
                {avatarLoading && (
                  <CircularProgress
                    className={styles.avatarprogress}
                    size={60}
                  />
                )}
                {!avatarLoading && (
                  <>
                    <input
                      className={styles.defaultinput}
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={async (e) => {
                        setAvatarLoading(true);
                        let file = e.target.files[0];
                        new Compressor(file, {
                          quality: 0.5,
                          maxWidth: 300,
                          maxHeight: 300,
                          success: async (result) => {
                            const uploadState = await handleUploadAvatar(
                              result
                            );
                            if (uploadState.success) {
                              setFile(uploadState.data.url);
                              setAvatarLoading(false);
                            } else {
                              setError("Error uploading avatar");
                            }
                          },
                          error(err) {
                            setError(err.message);
                          },
                        });
                      }}
                    />
                    <Avatar
                      className={styles.avatar}
                      src={file || null}
                      sx={{ width: 60, height: 60 }}
                    />
                    {!file && (
                      <div className={styles.avatarprompt}>Choose Avatar</div>
                    )}
                  </>
                )}
              </label>
            )}
            <TextField
              label="Username"
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <section className="buffer-20"></section>
            <TextField
              type="password"
              label="Password"
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!hasAccount && (
              <>
                <section className="buffer-20"></section>
                <TextField
                  label="First Name"
                  variant="standard"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <section className="buffer-20"></section>
                <TextField
                  label="Last Name"
                  variant="standard"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <section className="buffer-20"></section>
                <ToggleButtonGroup
                  value={role}
                  exclusive
                  onChange={(e, v) => {
                    if (!v) return;
                    setRole(v);
                  }}
                >
                  <ToggleButton value="student">Student</ToggleButton>
                  <ToggleButton value="teacher">Teacher</ToggleButton>
                </ToggleButtonGroup>
              </>
            )}
            {error ? (
              <p className="error">{error}</p>
            ) : (
              <section className="buffer-20"></section>
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
