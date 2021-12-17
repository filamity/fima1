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
      description: "A shared collection of photos uploaded by members of FI-MA1, and some of our own. Post some flowers!",
    },
    {
      name: "Desmos",
      url: "https://www.desmos.com/calculator",
      image: "/static/images/desmos.png",
      description: "My best friend, who surely needs no introduction. A calculator that can do not only math, but also... mostly math.",
    },
    {
      name: "Firefly",
      url: "https://harrowschool.fireflycloud.net/boys-dashboard",
      image: "/static/images/firefly.png",
      description: "Basically this website, but with around 3 more features and a bit more reddish. Go check what's for dinner!",
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
                  {tool.description}
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
