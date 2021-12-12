import { List, ListItem, ListItemText, Typography } from "@mui/material";
import styles from "../../styles/index/Reads.module.css";
import Box from "../global/Box";

const Reads = () => {
  return (
    <Box title="Reads" className={styles.reads}>
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
    </Box>
  );
};

export default Reads;
