import React, { useState } from "react";
import firebase from "firebase";
import { storage, db } from "./firebase";
import Button from "@material-ui/core/Button";
import "./App.css";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ImageUpload({ username }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [modalStyle] = React.useState(getModalStyle);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
          });
      }
    );
  };

  const wrapperfunction = () => {
    setOpen(false);
  };
  return (
    <div className="imageupload">
      <Modal className="modal" open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <progress
              className="imageupload_progress"
              value={progress}
              max="100"
            />
            <input
              className="imageupload_file"
              type="file"
              onChange={handleChange}
            ></input>
            <input
              className="imageupload_caption"
              type="text"
              placeholder="Enter a caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            ></input>
            <br />
            <Button className="imageupload_btn" onClick={handleUpload}>
              Upload Post
            </Button>

            <Button className="imageupload_btn" onClick={wrapperfunction}>
              Go to feed
            </Button>
          </form>
        </div>
      </Modal>

      <Button className="upload" onClick={() => setOpen(true)}>
        Upload A Post
      </Button>
    </div>
  );
}

export default ImageUpload;
