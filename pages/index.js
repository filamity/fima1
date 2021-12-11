import Announcements from "../components/index/Announcements";
import Reads from "../components/index/Reads";
import Tasks from "../components/index/Tasks";
import Tools from "../components/index/Tools";
import styles from "../styles/index/Home.module.css";

const Home = () => {
  
  return (
    <div className="container">
      <h1>Welcome to FI-MA1!</h1>
      <div className={styles.indexgrid}>
        <Announcements />
        <Tasks />
        <Reads />
        <Tools />
      </div>
    </div>
  );
}

export default Home;