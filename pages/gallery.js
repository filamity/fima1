import {
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import { Convert } from "mongo-image-converter";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/gallery/Gallery.module.css";
import Compressor from "compressorjs";
import { Delete, OpenInNew } from "@mui/icons-material";
import Box from "../components/global/Box";
import FileUpload from "../components/global/FileUpload";

const Gallery = ({ user }) => {
  const { currentUser } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]);
  const imagesSortedByDate = images.sort(
    (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [imageFile]);

  useEffect(() => {
    setLoading(true);
    if (currentUser) {
      axios
        .get("/api/upload")
        .then(({ data: { data } }) => {
          setImages(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setImages([]);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchImages = (cb) => {
    axios
      .get("/api/upload")
      .then(({ data: { data } }) => {
        setImages(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        cb();
      });
  };

  const convertImage = async (file) => {
    try {
      const converted = await Convert(file);
      return converted ? converted : null;
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteImage = (id) => {
    setLoading(true);
    axios
      .delete(`/api/upload/${id}`)
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        fetchImages(() => setLoading(false));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageToUpload = await convertImage(imageFile);
    if (!imageToUpload) {
      setError("Image must be in image/jpg or image/png format");
      return;
    }
    setLoading(true);
    axios
      .post("/api/upload", {
        image: imageToUpload,
        user: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      })
      .then((res) => {
        setImageFile(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        fetchImages(() => setLoading(false));
      });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.toLocaleString("default", { month: "short" });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  return (
    <div className="container">
      <h1>Gallery</h1>
      <Box title="Upload" disablePadding>
        <form onSubmit={handleSubmit}>
          <FileUpload
            imageFile={imageFile}
            handleDrop={(files) => {
              let file = files[0];
              new Compressor(file, {
                quality: 0.5,
                maxWidth: 1500,
                maxHeight: 1500,
                success(result) {
                  setImageFile(result);
                },
                error(err) {
                  setError(err.message);
                },
              });
            }}
          />
        </form>
      </Box>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <section className="buffer-15"></section>
      )}
      {loading && (
        <div className="loading">
          <CircularProgress />
        </div>
      )}
      <div className={styles.gallery}>
        {!loading &&
          imagesSortedByDate.map((image) => (
            <Card key={image._id}>
              <CardMedia
                component="img"
                height={300}
                image={image.image}
                title={`${image.firstName} ${image.lastName}`}
                alt={`${image.firstName} ${image.lastName}`}
              />
              <CardActions>
                <div>
                  <Typography>
                    {image.firstName} {image.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(image.uploadedAt)}
                  </Typography>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  {currentUser
                    ? (currentUser.role === "admin" ||
                        currentUser.role === "teacher") && (
                        <IconButton onClick={() => deleteImage(image._id)}>
                          <Delete />
                        </IconButton>
                      )
                    : null}
                  <IconButton
                    onClick={() => {
                      let imageToOpen = new Image();
                      imageToOpen.src = image.image;
                      let w = window.open("");
                      w.document.write(imageToOpen.outerHTML);
                    }}
                  >
                    <OpenInNew />
                  </IconButton>
                </div>
              </CardActions>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default withAuth(Gallery);
