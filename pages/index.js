import Login from "../components/global/Login";
import Announcements from "../components/index/Announcements";
import Notes from "../components/index/Notes";
import Reads from "../components/index/Reads";
import Tasks from "../components/index/Tasks";
import Links from "../components/index/Links";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/index/Home.module.css";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container">
      {currentUser && (
        <>
          <h1>
            Welcome, {currentUser.firstName} {currentUser.lastName}!
          </h1>
          <div className={styles.indexgrid}>
            <Announcements />
            <Tasks />
            <Reads />
            <Notes />
            <Links />
          </div>
        </>
      )}
      {!currentUser && (
        <>
          <h1>Welcome to FI-MA1!</h1>
          <Login />
        </>
      )}
    </div>
  );
};

export default Home;
