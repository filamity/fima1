import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Modal,
  Card,
  FormGroup,
  TextField,
  ButtonGroup,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/index/Tasks.module.css";
import Box from "../global/Box";
import axios from "axios";
import { Add, Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";

const Tasks = () => {
  const { currentUser } = useAuth();
  const isTeacher = currentUser.role === "teacher";
  const [tasks, setTasks] = useState([]);
  tasks.sort((a, b) => {
    return new Date(a.dueAt) - new Date(b.dueAt);
  });
  const [classTasks, setClassTasks] = useState([]);
  classTasks.sort((a, b) => {
    return new Date(a.dueAt) - new Date(b.dueAt);
  });
  let uncompletedTasks = tasks.filter((task) => task.completed === false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueAt: "",
  });

  useEffect(() => {
    setError("");
  }, [task]);

  useEffect(() => {
    setLoading(true);
    if (currentUser) {
      currentUser.role === "teacher"
        ? fetchClassTasks(() => setLoading(false))
        : fetchTasks(() => setLoading(false));
    } else {
      setTasks([]);
      setClassTasks([]);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchClassTasks = (cb) => {
    axios.get(`/api/tasks`).then(({ data: { data } }) => {
      setClassTasks(data);
      cb();
    });
  };

  const fetchTasks = (cb) => {
    axios.get(`/api/tasks/${currentUser._id}`).then(({ data: { data } }) => {
      setTasks(data);
      cb();
    });
  };

  const updateTask = (taskId, completed) => {
    axios.put(`/api/tasks/${taskId}`, {
      student: currentUser._id,
      completed: completed,
    });
  };

  const createTask = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(isTeacher ? `/api/tasks` : `/api/tasks/${currentUser._id}`, {
        title: task.title,
        description: task.description,
        dueAt: task.dueAt,
      })
      .then((res) => {
        setModalOpen(false);
        setTask({
          title: "",
          description: "",
          dueAt: "",
        });
        isTeacher
          ? fetchClassTasks(() => setLoading(false))
          : fetchTasks(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.toLocaleString("default", { month: "short" });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  const taskStatus = (date) => {
    const d = new Date(date);
    const today = new Date();
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      return { name: "Today", color: "error" };
    } else if (d < today) {
      return { name: "Overdue", color: "error" };
    } else if (d > today) {
      return { name: "Upcoming", color: "primary" };
    }
  };

  return (
    <Box title="Tasks" className={styles.tasks}>
      <ButtonGroup>
        <Button onClick={() => setModalOpen(true)} variant="contained">
          <Add />
        </Button>
        {!isTeacher && (
          <Button
            onClick={() => setShowCompleted((prev) => !prev)}
            variant="contained"
          >
            {showCompleted ? <VisibilityOff /> : <Visibility />}
          </Button>
        )}
      </ButtonGroup>

      <section className="buffer-10"></section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Card className={styles.card}>
          <div className="title">
            {isTeacher ? "New Class Task" : "New Personal Task"}
          </div>
          <section className="buffer-20"></section>
          <form onSubmit={createTask}>
            <FormGroup>
              <TextField
                name="title"
                onChange={handleChange}
                label="Title"
                variant="standard"
                required
              />
              <section className="buffer-20"></section>
              <TextField
                name="description"
                onChange={handleChange}
                label="Description"
                multiline
                rows={5}
                required
              />
              <section className="buffer-20"></section>
              <TextField
                name="dueAt"
                onChange={handleChange}
                label="Due At"
                type="date"
                InputLabelProps={{ shrink: true }}
                required
              />
              {error ? (
                <p className="error">{error}</p>
              ) : (
                <section className="buffer-20"></section>
              )}
              <Button variant="contained" color="primary" type="submit">
                {loading ? (
                  <div className="loadingbutton">
                    <CircularProgress color="inherit" size={20} />
                  </div>
                ) : (
                  "Create"
                )}
              </Button>
            </FormGroup>
          </form>
        </Card>
      </Modal>

      {loading && (
        <div className="loading" style={{ color: "white" }}>
          <CircularProgress color="inherit" />
        </div>
      )}

      {!loading
        ? isTeacher
          ? !classTasks.length && (
              <List sx={{ bgcolor: "background.paper" }}>
                <ListItem>
                  <ListItemText primary="No Tasks to show" />
                </ListItem>
              </List>
            )
          : !(showCompleted ? tasks : uncompletedTasks).length && (
              <List sx={{ bgcolor: "background.paper" }}>
                <ListItem>
                  <ListItemText primary="No Tasks to show" />
                </ListItem>
              </List>
            )
        : null}

      <List disablePadding>
        {!loading
          ? isTeacher
            ? classTasks.map((task) => (
                <Link key={task._id} href={`/task/${task._id}`} passHref>
                  <ListItem
                    key={task._id}
                    sx={{ bgcolor: "background.paper" }}
                    disablePadding
                    secondaryAction={
                      <b>
                        {
                          task.completeStatus.filter(
                            (student) => student.completed === true
                          ).length
                        }
                        /{task.completeStatus.length}
                      </b>
                    }
                  >
                    <ListItemButton>
                      <ListItemText
                        primary={
                          <>
                            <span
                              className="chip"
                              data-status={taskStatus(task.dueAt).color}
                            >
                              {taskStatus(task.dueAt).name}
                            </span>
                            <span className="inlinebuffer-10"></span>
                            {task.title}
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))
            : tasks.length
            ? (showCompleted ? tasks : uncompletedTasks).map((task) => (
                <ListItem
                  key={task._id}
                  sx={{ bgcolor: "background.paper" }}
                  disablePadding
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={(e) => {
                        setTasks((prev) => {
                          return prev.map((t) => {
                            if (t._id === task._id) {
                              t.completed = e.target.checked;
                            }
                            return t;
                          });
                        });
                        updateTask(task._id, e.target.checked);
                      }}
                      checked={
                        tasks.find((t) => t._id === task._id)?.completed ||
                        false
                      }
                    />
                  }
                >
                  <ListItemButton>
                    <Link key={task._id} href={`/task/${task._id}`} passHref>
                      <ListItemText
                        primary={
                          <>
                            <span
                              className="chip"
                              data-status={taskStatus(task.dueAt).color}
                            >
                              {taskStatus(task.dueAt).name}
                            </span>
                            <span className="inlinebuffer-10"></span>
                            {task.title}
                          </>
                        }
                      />
                    </Link>
                  </ListItemButton>
                </ListItem>
              ))
            : null
          : null}
      </List>
    </Box>
  );
};

export default Tasks;
