import { Add, Delete, DoDisturb, Edit } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/index/Notes.module.css";
import Box from "../global/Box";

const Notes = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [note, setNote] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    setLoading(true);
    if (currentUser) {
      axios.get(`/api/notes/${currentUser._id}`).then(({ data: { data } }) => {
        setNotes(data);
        setLoading(false);
      });
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setError("");
  }, [note]);

  const fetchNotes = (cb) => {
    axios.get(`/api/notes/${currentUser._id}`).then(({ data: { data } }) => {
      setNotes(data);
      cb();
    });
  };

  const createNote = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`/api/notes/${currentUser._id}`, {
        title: note.title,
        description: note.description,
      })
      .then((res) => {
        setModalOpen(false);
        setNote({
          title: "",
          description: "",
        });
        fetchNotes(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const editNote = (noteId) => {
    setModalOpen(true);
    let noteToEdit = notes.find((note) => note._id === noteId);
    setNote({
      title: noteToEdit.title,
      description: noteToEdit.description,
    });
    setEditing(noteId);
  };

  const updateNote = (e) => {
    e.preventDefault();
    setLoading(true);
    let noteToUpdate = notes.find((note) => note._id === editing);
    axios
      .put(`/api/notes/${noteToUpdate._id}`, {
        title: note.title,
        description: note.description,
      })
      .then((res) => {
        setModalOpen(false);
        setNote({
          title: "",
          description: "",
        });
        fetchNotes(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const deleteNotes = () => {
    setLoading(true);
    selected.forEach((note, idx, arr) => {
      axios.delete(`/api/notes/${note}`).then(() => {
        if (idx === arr.length - 1) {
          fetchNotes(() => setLoading(false));
          setSelected([]);
          setSelecting(false);
        }
      });
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNote((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box title="Notes" className={styles.notes}>
      <ButtonGroup color="primary" variant="contained">
        <Button
          onClick={() => {
            setModalOpen(true);
            setEditing(null);
          }}
        >
          <Add />
        </Button>
        <Button
          onClick={() => {
            if (selecting) setSelected([]);
            setSelecting((prev) => !prev);
          }}
          color="primary"
        >
          {selecting ? <DoDisturb /> : <Delete />}
        </Button>
        {selected.length && selecting ? (
          <Button onClick={deleteNotes} color="error">
            <Delete />
          </Button>
        ) : null}
      </ButtonGroup>
      <section className="buffer-10"></section>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setNote({
            title: "",
            description: "",
          });
        }}
      >
        <Card className={styles.card}>
          <div className="title">{editing ? "Edit" : "New"} Note</div>
          <section className="buffer-20"></section>
          <form onSubmit={editing ? updateNote : createNote}>
            <FormGroup>
              <TextField
                name="title"
                onChange={handleChange}
                value={note.title}
                label="Title"
                variant="standard"
                required
              />
              <section className="buffer-20"></section>
              <TextField
                name="description"
                onChange={handleChange}
                value={note.description}
                label="Description"
                multiline
                rows={5}
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
                ) : editing ? (
                  "Save"
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
        ? !notes.length && (
            <List sx={{ bgcolor: "background.paper" }}>
              <ListItem>
                <ListItemText primary="No Notes" />
              </ListItem>
            </List>
          )
        : null}

      {!loading && (
        <div className={styles.notegrid}>
          {notes.length
            ? notes.map((note) => (
                <Card key={note._id} className={styles.notecard}>
                  <CardContent
                    sx={{
                      opacity: selecting ? 0.3 : 1,
                    }}
                  >
                    <Typography variant="h5" component="div">
                      {note.title}
                    </Typography>
                    <Typography variant="body2">{note.description}</Typography>
                  </CardContent>
                  <section style={{ height: "56px" }}></section>
                  <div
                    style={{
                      opacity: selecting ? 0.3 : 1,
                    }}
                    className={styles.notecardactions}
                  >
                    <Divider />
                    <CardActions>
                      <IconButton
                        onClick={() => editNote(note._id)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </CardActions>
                  </div>
                  {selecting && (
                    <Checkbox
                      checked={selected.includes(note._id)}
                      color="error"
                      sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%) scale(1.2)",
                      }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected([...selected, note._id]);
                        } else {
                          setSelected(selected.filter((id) => id !== note._id));
                        }
                      }}
                    />
                  )}
                </Card>
              ))
            : null}
        </div>
      )}
    </Box>
  );
};

export default Notes;
