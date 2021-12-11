import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import styles from "../../styles/index/Reads.module.css";

const Reads = () => {
  return (
    <div className={styles.reads}>
      <div className="subtitle">Reads</div>
      <List sx={{ bgcolor: "background.paper" }}>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary="Oui Oui"
            secondary={
              <>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Sandra Adams
                </Typography>
                {" — Do you have Paris recommendations? Have you ever…"}
              </>
            }
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary="Oui Oui"
            secondary={
              <>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Sandra Adams
                </Typography>
                {" — Do you have Paris recommendations? Have you ever…"}
              </>
            }
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary="Oui Oui"
            secondary={
              <>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Sandra Adams
                </Typography>
                {" — Do you have Paris recommendations? Have you ever…"}
              </>
            }
          />
        </ListItem>
      </List>
    </div>
  );
};

export default Reads;
