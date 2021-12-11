import {
  Avatar,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import styles from "../../styles/index/Tasks.module.css";

const Tasks = () => {
  return (
    <div className={styles.tasks}>
      <div className="subtitle">Tasks</div>
      <List>
        {[0, 1, 2, 3].map((value) => {
          return (
            <ListItem
              key={value}
              secondaryAction={
                <Checkbox edge="end" onChange={() => {}} checked={false} />
              }
              sx={{ bgcolor: "background.paper" }}
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    alt="Avatar"
                    src={`/static/images/avatar/${value + 1}.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText primary={`Line item ${value + 1}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Tasks;
