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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/index/Tasks.module.css";
import Box from "../global/Box";
import axios from "axios";
import { Add } from "@mui/icons-material";

const Tasks = ({ tasks }) => {
  const { currentUser } = useAuth();
  const [checked, setChecked] = useState(tasks);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueAt: "",
  });

  useEffect(() => {
    setChecked(tasks);
  }, [tasks]);

  useEffect(() => {
    setError("");
  }, [task]);

  const updateTask = (taskId, completed) => {
    axios
      .put(`/api/tasks/${taskId}`, {
        completed: completed,
      })
      .then((res) => {
        // console.log(res.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const createTask = (e) => {
    e.preventDefault();
    axios
      .post(`/api/tasks/${currentUser._id}`, {
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
        window.location.reload();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box title="Tasks" className={styles.tasks}>
      <Button onClick={() => setModalOpen(true)} variant="contained">
        <Add />
      </Button>

      <section className="buffer-10"></section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Card className={styles.card}>
          <div className="title">New Task</div>
          <section className="buffer-20"></section>
          <form onSubmit={createTask}>
            <FormGroup>
              <TextField
                name="title"
                onChange={handleChange}
                label="Title"
                variant="standard"
                // required
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
                Create
              </Button>
            </FormGroup>
          </form>
        </Card>
      </Modal>

      {!checked.length && (
        <List sx={{ bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemText primary="No Tasks" />
          </ListItem>
        </List>
      )}

      <List disablePadding>
        {checked.length && tasks.length
          ? tasks.map((task) => (
              <ListItem
                key={task._id}
                sx={{ bgcolor: "background.paper" }}
                disablePadding
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={(e) => {
                      setChecked((prev) => {
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
                      checked.find((t) => t._id === task._id)?.completed ||
                      false
                    }
                  />
                }
              >
                <ListItemButton>
                  <ListItemText primary={task.title} />
                </ListItemButton>
              </ListItem>
            ))
          : null}
      </List>
    </Box>
  );
};

export default Tasks;
