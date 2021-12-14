import { Upload } from "@mui/icons-material";
import { IconButton, List, ListItem } from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../../styles/global/FileUpload.module.css";

const FileUpload = ({ imageFile, handleDrop }) => {
  const onDrop = useCallback((acceptedFiles) => {
    handleDrop(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: "image/jpeg, image/png",
  });

  const selectedFile = imageFile ? (
    <ListItem
      key={imageFile.path}
      secondaryAction={
        <>
          <b>{Math.round(imageFile.size / 1024)} KB</b>
          <span className="inlinebuffer-5"></span>
          <IconButton color="inherit" type="submit">
            <Upload />
          </IconButton>
        </>
      }
    >
      {imageFile.name}
    </ListItem>
  ) : (
    <ListItem>No file selected</ListItem>
  );

  return (
    <>
      <div
        {...getRootProps()}
        className={styles.dropzone}
        data-status={isDragActive ? "active" : "normal"}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className={styles.dropzonetext}>Drop the file here...</div>
        ) : (
          <div>
            <div className={styles.dropzonetext}>
              Drag and drop onto here, or click to select file
            </div>
            <div>Accepts only .png or .jpg under 16MB</div>
          </div>
        )}
      </div>
      <List sx={{ bgcolor: "var(--blue-3)", color: "white" }}>
        {selectedFile}
      </List>
    </>
  );
};

export default FileUpload;
