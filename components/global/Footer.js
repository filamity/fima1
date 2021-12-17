import styles from "../../styles/global/Footer.module.css";
import Box from "@mui/material/Box";
import { GitHub } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={`${styles.footerwrap} shadow`}>
      <Box>FI-MA1</Box>
      <Link href="https://github.com/filamity/fima1" passHref>
        <IconButton component="a" color="inherit">
          <GitHub fontSize="large" className={styles.github} />
        </IconButton>
      </Link>
    </div>
  );
};

export default Footer;
