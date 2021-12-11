import styles from "../../styles/global/Layout.module.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className={styles.app}>
      <Navbar />
      <div className={styles.content}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;