import styles from "../../styles/global/Footer.module.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

const Footer = () => {
  return (
    <div className={`${styles.footerwrap} shadow`}>
      <Box sx={{ pb: 2 }}>
        FI-MA1
      </Box>
      <Box>
        <GitHubIcon onClick={() => {
    window.open("https://github.com/filamity/fima1");
  }} fontSize="large" className={styles.github} />
      </Box>
      
    
    </div>
  );
};

export default Footer;
