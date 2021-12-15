import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import styles from "../../styles/index/Links.module.css";
import Box from "../global/Box";

const Links = () => {
  const links = [
    {
      name: "Gallery",
      url: "/gallery",
      image: "/static/images/gallery.jpg",
    },
    {
      name: "Desmos",
      url: "https://www.desmos.com/calculator",
      image: "/static/images/desmos.png",
    },
    {
      name: "Firefly",
      url: "https://harrowschool.fireflycloud.net/boys-dashboard",
      image: "/static/images/firefly.png",
    },
  ];

  return (
    <Box title="Links" className={styles.links}>
      <div className={styles.linksgrid}>
        {links.map((tool) => (
          <Card className={styles.tool} key={tool.name}>
            <CardActionArea
              href={tool.url}
              rel="noopener noreferrer"
            >
              <CardMedia
                className={styles.toolimage}
                height="140"
                src={tool.image}
                component="img"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {tool.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </Box>
  );
};

export default Links;
