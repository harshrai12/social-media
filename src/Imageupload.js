import React, { useState } from "react";
import firebase from "firebase";
import { storage, db } from "./firebase";
import Button from "@material-ui/core/Button";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

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
  return (
    <div className="imageupload">
      <progress className="imageupload_progress" value={progress} max="100" />
      <input
        className="imageupload_file"
        type="file"
        onChange={handleChange}
      ></input>
      <input
        className="imageupload_caption"
        type="text"
        placeholder="Enter a caption"
        placeholder="Caption"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      ></input>
      <br />
      <Button className="imageupload_btn" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
