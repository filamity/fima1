import { useState } from "react";
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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import styles from "../../styles/global/Navbar.module.css";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setOpen((prev) => !prev)}
    >
      <List>
        {["Homework", "Homework", "Homework", "Homework"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Homework", "Homework", "Homework"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
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
          <Typography variant="h6" component="div">
            FI-MA1
          </Typography>
          <div className={styles.accountbutton}>
            <IconButton size="large" onClick={e => setAnchorEl(e.currentTarget)} color="inherit">
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>My account</MenuItem>
            </Menu>
          </div>
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
