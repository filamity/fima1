import { useEffect, useState } from "react";
import styles from "../../styles/index/Announcements.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Box from "../global/Box";
import {
  Button,
  Card,
  Checkbox,
  FormGroup,
  Modal,
  TextField,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Add, Delete, ExpandMore, DoDisturb } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

import Markdown from "../global/MathMark";

const Announcements = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    setLoading(true);
    if (currentUser) {
      axios.get("/api/announcements").then(({ data: { data } }) => {
        setAnnouncements(data);
        setLoading(false);
      });
    } else {
      setAnnouncements([]);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setError("");
  }, [announcement]);

  const fetchAnnouncements = (cb) => {
    axios.get("/api/announcements").then(({ data: { data } }) => {
      setAnnouncements(data);
      cb();
    });
  };

  const createAnnouncement = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/announcements", announcement)
      .then((res) => {
        setModalOpen(false);
        setAnnouncement({
          title: "",
          description: "",
        });
        fetchAnnouncements(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const deleteAnnouncements = () => {
    setLoading(true);
    selected.forEach((announcement, idx, arr) => {
      axios.delete(`/api/announcements/${announcement}`).then(() => {
        if (idx === arr.length - 1) {
          fetchAnnouncements(() => setLoading(false));
          setSelected([]);
          setSelecting(false);
        }
      });
    });
  };

  const handleAccordion = (panel) => (event, isExpanded) => {
    if (event.target.classList.contains("PrivateSwitchBase-input")) return;
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.toLocaleString("default", { month: "short" });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  return (
    <Box title="Announcements" className={styles.announcements}>
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
              <Button onClick={deleteAnnouncements} color="error">
                <Delete />
              </Button>
            ) : null}
          </ButtonGroup>
          <section className="buffer-10"></section>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Card className={styles.card}>
          <div className="title">New Announcement</div>
          <section className="buffer-20"></section>
          <form onSubmit={createAnnouncement}>
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
        ? !announcements.length && (
            <List sx={{ bgcolor: "background.paper" }}>
              <ListItem>
                <ListItemText primary="No Announcements" />
              </ListItem>
            </List>
          )
        : null}

      {!loading
        ? announcements.length
          ? announcements.map((announcement) => (
              <Accordion
                key={announcement._id}
                expanded={expanded === announcement._id}
                onChange={handleAccordion(announcement._id)}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ opacity: selecting ? 0.3 : 1 }}>
                    <span className="chip">
                      {formatDate(announcement.createdAt)}
                    </span>
                    <span className="inlinebuffer-10"></span>
                    {announcement.title}
                  </Typography>
                  {selecting ? (
                    <Checkbox
                      color="error"
                      sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%) scale(1.2)",
                      }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected((prev) => [...prev, announcement._id]);
                        } else {
                          setSelected((prev) =>
                            prev.filter((id) => id !== announcement._id)
                          );
                        }
                      }}
                      checked={selected.includes(announcement._id)}
                    />
                  ) : null}
                </AccordionSummary>
                <AccordionDetails sx={{ opacity: selecting ? 0.3 : 1 }}>
                  <Markdown>{announcement.description}</Markdown>
                </AccordionDetails>
              </Accordion>
            ))
          : null
        : null}
    </Box>
  );
};

export default Announcements;
