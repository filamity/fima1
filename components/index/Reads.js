import {
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  CircularProgress,
  FormGroup,
  Link,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/index/Reads.module.css";
import Box from "../global/Box";
import axios from "axios";
import { Add, Delete, DoDisturb } from "@mui/icons-material";

const Reads = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reads, setReads] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [read, setRead] = useState({
    title: "",
    description: "",
    link: "",
  });

  useEffect(() => {
    setLoading(true);
    if (currentUser) {
      axios.get("/api/reads").then(({ data: { data } }) => {
        setReads(data);
        setLoading(false);
      });
    } else {
      setReads([]);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setError("");
  }, [read]);

  const fetchReads = (cb) => {
    axios.get("/api/reads").then(({ data: { data } }) => {
      setReads(data);
      cb();
    });
  };

  const createRead = (e) => {
    e.preventDefault();
    setLoading(true);
    let formattedLink = read.link;
    if (!/^https?:\/\//i.test(formattedLink)) {
      formattedLink = `http://${formattedLink}`;
    }
    axios
      .post("/api/reads", {
        title: read.title,
        description: read.description,
        link: formattedLink,
      })
      .then((res) => {
        setModalOpen(false);
        setRead({
          title: "",
          description: "",
          link: "",
        });
        fetchReads(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const deleteReads = () => {
    setLoading(true);
    selected.forEach((read, idx, arr) => {
      axios.delete(`/api/reads/${read}`).then(() => {
        if (idx === arr.length - 1) {
          fetchReads(() => setLoading(false));
          setSelected([]);
          setSelecting(false);
        }
      });
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRead((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box title="Reads" className={styles.reads}>
      {(currentUser.role === "admin" || currentUser.role === "teacher") && (
        <>
          <ButtonGroup color="primary" variant="contained">
            <Button onClick={() => setModalOpen(true)}>
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
              <Button onClick={deleteReads} color="error">
                <Delete />
              </Button>
            ) : null}
          </ButtonGroup>
          <section className="buffer-10"></section>
        </>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Card className={styles.card}>
          <div className="title">New Read</div>
          <section className="buffer-20"></section>
          <form onSubmit={createRead}>
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
                name="link"
                onChange={handleChange}
                label="Link"
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

      {loading && (
        <div className="loading" style={{ color: "white" }}>
          <CircularProgress color="inherit" />
        </div>
      )}

      {!loading && (
        <List sx={{ bgcolor: "background.paper" }}>
          {!reads.length && (
            <ListItem alignItems="flex-start">
              <ListItemText primary="No Reads" />
            </ListItem>
          )}
          {reads.length
            ? reads.map((read) => (
                <ListItem
                  key={read._id}
                  alignItems="flex-start"
                  secondaryAction={
                    selecting ? (
                      <Checkbox
                        edge="end"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelected((prev) => [...prev, read._id]);
                          } else {
                            setSelected((prev) =>
                              prev.filter((id) => id !== read._id)
                            );
                          }
                        }}
                        checked={selected.includes(read._id)}
                      />
                    ) : null
                  }
                >
                  <ListItemText
                    primary={<Link href={read.link}>{read.title}</Link>}
                    secondary={read.description}
                  />
                </ListItem>
              ))
            : null}
        </List>
      )}
    </Box>
  );
};

export default Reads;
