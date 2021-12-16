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
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/gallery/Gallery.module.css";
import Compressor from "compressorjs";
import { Delete, OpenInNew } from "@mui/icons-material";
import Box from "../components/global/Box";
import FileUpload from "../components/global/FileUpload";
import handleUpload from "../components/gallery/handleUpload";

const Gallery = ({ user }) => {
  const { currentUser } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]);
  images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setError("");
  }, [imageFile]);

  useEffect(() => {
    setLoading(true);
    if (currentUser) {
      fetchImages(() => setLoading(false));
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
        cb();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const deleteImage = (id) => {
    setLoading(true);
    axios
      .delete(`/api/upload/${id}`)
      .then(() => {
        fetchImages(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleUpload(
      imageFile,
      currentUser._id,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.username,
      setError,
      setProgress,
      () => {
        setImageFile(null);
        fetchImages(() => setLoading(false));
      }
    );
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
          images.map((image) => (
            <Card key={image._id}>
              <CardMedia
                component="img"
                height={300}
                image={image.url}
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
                  <IconButton onClick={() => window.open(image.url, "_blank")}>
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
