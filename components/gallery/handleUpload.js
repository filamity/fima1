import { firestorage } from "../../utils/firebase";
import axios from "axios";

const handleUpload = async (file, user, setError, setProgress, cb) => {
  if (!file) return;
  const storageRef = firestorage.ref(`uploads/${file.name}`);

  storageRef.put(file).on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setProgress(progress);
    },
    (error) => {
      setError(error);
    },
    () => {
      storageRef.getDownloadURL().then((url) => {
        axios
          .post("/api/upload", {
            url,
            user,
          })
          .then(() => {
            cb();
          })
          .catch((err) => {
            setError(err.message);
          });
      });
    }
  );
};

export default handleUpload;
