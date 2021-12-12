import axios from "axios";
import { useState, useEffect } from "react";
import Login from "../components/global/Login";
import Announcements from "../components/index/Announcements";
import Reads from "../components/index/Reads";
import Tasks from "../components/index/Tasks";
import Tools from "../components/index/Tools";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/index/Home.module.css";

const Home = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reads, setReads] = useState([]);

  useEffect(() => {
    if (currentUser) {
      axios.get("/api/announcements").then(({ data: { data } }) => {
        setAnnouncements(data);
      });
      axios.get(`/api/tasks/${currentUser._id}`).then(({ data: { data } }) => {
        setTasks(data);
      });
    }
  }, [currentUser]);

  return (
    <div className="container">
      {currentUser && (
        <>
          <h1>Welcome, {currentUser.firstName} {currentUser.lastName}!</h1>
          <div className={styles.indexgrid}>
            <Announcements announcements={announcements} />
            <Tasks tasks={tasks} />
            <Reads />
            <Tools />
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

// Home.getInitialProps = async () => {
//   const resNotes = await fetch("http://localhost:3000/api/notes");
//   const resAnnouncements = await fetch(
//     "http://localhost:3000/api/announcements"
//   );
//   const resTasks = await fetch("http://localhost:3000/api/tasks");

//   const notes = await resNotes.json();
//   const announcements = await resAnnouncements.json();
//   const tasks = await resTasks.json();

//   return { notes, announcements, tasks };
// };

export default Home;
