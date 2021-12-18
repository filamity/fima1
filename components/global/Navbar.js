import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Collections, Home, Logout, PrivacyTip } from "@mui/icons-material";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { Avatar, CircularProgress } from "@mui/material";
import { firestorage } from "../../utils/firebase";
import Compressor from "compressorjs";
import axios from "axios";

import styles from "../../styles/global/Navbar.module.css";

const Navbar = () => {
  const { refreshUser, logout, currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const types = ["image/png", "image/jpeg"];

  useEffect(() => {
    setError("");
  }, [file, avatarLoading]);

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setOpen((prev) => !prev)}
    >
      <List>
        <Link href="/" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link href="/gallery" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <Collections />
            </ListItemIcon>
            <ListItemText primary="Gallery" />
          </ListItem>
        </Link>
        <Link href="/static/privacy/Privacy Notice FIMA1.pdf" passHref>
          <ListItem button component="a" target="_blank">
            <ListItemIcon>
              <PrivacyTip />
            </ListItemIcon>
            <ListItemText primary="Privacy Policy" />
          </ListItem>
        </Link>
      </List>
    </Box>
  );

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

  const updateUserAvatar = async (url, cb) => {
    axios
      .put(`/api/user/${currentUser._id}`, { avatar: url })
      .then((res) => {
        refreshUser();
        cb();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={styles.navwrap}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setOpen((prev) => !prev)}
          >
            <MenuIcon />
          </IconButton>
          <span className="inlinebuffer-10"></span>
          <Typography variant="h6" component="div" className={styles.link}>
            <Link href="/">FI-MA1 (v1.2)</Link>
          </Typography>
          <div className={styles.accountbutton}>
            <Link href="/static/privacy/Privacy Notice FIMA1.pdf" passHref>
              <IconButton
                component="a"
                target="_blank"
                size="large"
                color="inherit"
              >
                <PrivacyTip />
              </IconButton>
            </Link>
            <IconButton
              size="large"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              color="inherit"
            >
              {currentUser ? (
                <Avatar
                  src={
                    currentUser.avatar ||
                    file ||
                    "/static/images/defaultavatar.png"
                  }
                  alt={currentUser.username}
                  className={styles.avatar}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </div>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {currentUser ? (
              <div>
                <Box ml={2} mb={1} mt={1} mr={2} display="flex">
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
                                  updateUserAvatar(uploadState.data.url, () =>
                                    setAvatarLoading(false)
                                  );
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
                          src={
                            currentUser.avatar ||
                            file ||
                            "/static/images/defaultavatar.png"
                          }
                          sx={{ width: 60, height: 60 }}
                        />
                        {!currentUser.avatar && !file && (
                          <div className={styles.avatarprompt}>
                            Choose Avatar
                          </div>
                        )}
                      </>
                    )}
                  </label>
                  <span className="inlinebuffer-15"></span>
                  <div>
                    <Typography variant="h6">
                      {currentUser.firstName} {currentUser.lastName}
                    </Typography>
                    <Typography className="capitalize" color="text.secondary">
                      {currentUser.role}
                    </Typography>
                  </div>
                </Box>
                {error && (
                  <div className={`error ${styles.error}`}>{error}</div>
                )}
                {/* <MenuItem>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem> */}
                <MenuItem onClick={() => logout()}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </div>
            ) : (
              <Box ml={2} mb={1} mt={1} mr={2}>
                <Typography>You are currently not logged in.</Typography>
              </Box>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <div className={styles.drawerheading}>
          <div>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
        </div>
        <Divider />
        {list()}
      </Drawer>

      <Toolbar />
    </>
  );
};

export default Navbar;
