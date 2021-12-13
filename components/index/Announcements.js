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
} from "@mui/material";
import axios from "axios";
import {
  Add,
  Remove,
  Delete,
  ExpandMore,
  DoDisturb,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const Announcements = ({ announcements, setAnnouncements }) => {
  const { currentUser } = useAuth();
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
    setError("");
  }, [announcement]);

  const fetchAnnouncements = () => {
    axios.get("/api/announcements").then(({ data: { data } }) => {
      setAnnouncements(data);
    });
  };

  const createAnnouncement = (e) => {
    e.preventDefault();
    axios
      .post("/api/announcements", announcement)
      .then((res) => {
        setModalOpen(false);
        setAnnouncement({
          title: "",
          description: "",
        });
        fetchAnnouncements();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const deleteAnnouncements = () => {
    selected.forEach((announcement, idx, arr) => {
      axios.delete(`/api/announcements/${announcement}`).then(() => {
        if (idx === arr.length - 1) {
          fetchAnnouncements();
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
                Create
              </Button>
            </FormGroup>
          </form>
        </Card>
      </Modal>

      {!announcements.length && (
        <List sx={{ bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemText primary="No Announcements" />
          </ListItem>
        </List>
      )}

      {announcements.length
        ? announcements.map((announcement) => (
            <Accordion
              key={announcement._id}
              expanded={expanded === announcement._id}
              onChange={handleAccordion(announcement._id)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{announcement.title}</Typography>
                {selecting ? (
                  <Checkbox
                    edge="end"
                    className={styles.checkbox}
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
              <AccordionDetails>
                <Typography>{announcement.description}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        : null}
    </Box>
  );
};

export default Announcements;
