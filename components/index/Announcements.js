import { useState } from "react";
import styles from "../../styles/index/Announcements.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "../global/Box";
import { Button, Card, FormGroup, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const Announcements = ({ announcements }) => {
  const { currentUser } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
  });

  const createAnnouncement = (e) => {
    e.preventDefault();
    axios.post("/api/announcements", announcement).then((res) => {
      setModalOpen(false);
      setAnnouncement({
        title: "",
        description: "",
      });
    });
  };

  const handleAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box title="Announcements" className={styles.announcements}>
      {(currentUser.role === "admin" || currentUser.role === "teacher") && (
        <Button onClick={() => setModalOpen(true)} variant="contained">
          New Announcement
        </Button>
      )}
      <section className="buffer-10"></section>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Card className={styles.card}>
          <div className="title">New Task</div>
          <section className="buffer-20"></section>
          <form onSubmit={createAnnouncement}>
            <FormGroup>
              <TextField
                name="title"
                onChange={handleChange}
                label="Title"
                variant="standard"
              />
              <section className="buffer-20"></section>
              <TextField
                name="description"
                onChange={handleChange}
                label="Description"
                multiline
                rows={5}
              />
              <section className="buffer-20"></section>
              <Button variant="contained" color="primary" type="submit">
                Create
              </Button>
            </FormGroup>
          </form>
        </Card>
      </Modal>

      {announcements &&
        announcements.map((announcement) => (
          <Accordion
            key={announcement._id}
            expanded={expanded === announcement._id}
            onChange={handleAccordion(announcement._id)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{announcement.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{announcement.description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  );
};

export default Announcements;
