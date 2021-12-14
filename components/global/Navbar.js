import { useState } from "react";
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
import { Collections, Home, Logout } from "@mui/icons-material";
import Link from "next/link";

import styles from "../../styles/global/Navbar.module.css";

const Navbar = () => {
  const { logout, currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

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
      </List>
    </Box>
  );

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
            <Link href="/">FI-MA1</Link>
          </Typography>
          <div className={styles.accountbutton}>
            <IconButton
              size="large"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              color="inherit"
            >
              <AccountCircle />
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
                <Box ml={2} mb={1} mt={1} mr={2}>
                  <Typography variant="h6">
                    {currentUser.firstName} {currentUser.lastName}
                  </Typography>
                  <Typography className="capitalize" color="text.secondary">
                    {currentUser.role}
                  </Typography>
                </Box>
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
