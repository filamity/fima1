import axios from "axios";
import { useState, useEffect } from "react";
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
  const [announcements, setAnnouncements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reads, setReads] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (currentUser) {
      axios.get("/api/announcements").then(({ data: { data } }) => {
        setAnnouncements(data);
      });
      axios.get("/api/reads").then(({ data: { data } }) => {
        setReads(data);
      });
      axios.get(`/api/tasks/${currentUser._id}`).then(({ data: { data } }) => {
        setTasks(data);
      });
      axios.get(`/api/notes/${currentUser._id}`).then(({ data: { data } }) => {
        setNotes(data);
      });
    } else {
      setAnnouncements([]);
      setReads([]);
      setTasks([]);
      setNotes([]);
    }
  }, [currentUser]);

  return (
    <div className="container">
      {currentUser && (
        <>
          <h1>
            Welcome, {currentUser.firstName} {currentUser.lastName}!
          </h1>
          <div className={styles.indexgrid}>
            <Announcements
              announcements={announcements}
              setAnnouncements={setAnnouncements}
            />
            <Tasks tasks={tasks} setTasks={setTasks} />
            <Reads reads={reads} setReads={setReads} />
            <Notes notes={notes} setNotes={setNotes} />
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
