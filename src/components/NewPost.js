import React, { useState, useRef } from "react";
import { FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dropzone from "react-dropzone";
import { useAuth0 } from "../react-auth0-spa";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function App() {
    const [fileNames, setFileNames] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('')
    const imageData = useRef(new FormData());
    //gets token geterator and user info from Auth0
    const { user, getTokenSilently } = useAuth0();

    //for material ui
    const classes = useStyles();

    //stores image upload data


    const handleDrop = async (acceptedFiles) => {

        imageData.current.append(`file`, acceptedFiles[0]);

        setFileNames(acceptedFiles.map(file => file.name));
        //sets temp image for photo preview
        setImageUrls(acceptedFiles.map(file => URL.createObjectURL(file)));

    }

    const handleFormTitle = (e) => setPostTitle(e.target.value);
    const handleFormDescription = (e) => setPostDescription(e.target.value);

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        //makes sure a photo was uploaded
        if (imageUrls.length === 0) {
            alert('please upload a photo')
            return;
        }

        //gets token for authentication
        const token = await getTokenSilently();
        //uploads image to aws and receives image url
        const imageRes = await fetch('http://localhost:3001/posts/image/upload', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: imageData.current
        })
        const imageResData = await imageRes.json()



    }

    return (
        <div className="new-post-form-container" onSubmit={handlePostSubmit} >
            <form className={classes.root} autoComplete="off">
                <TextField id="new-post-title"
                    label="Add a Title"
                    variant="outlined"
                    value={postTitle}
                    onChange={handleFormTitle}
                    required
                />
                <TextField id="new-post-description"
                    label="Add a Description"
                    variant="outlined"
                    value={postDescription}
                    onChange={handleFormDescription}
                    required
                />
                <Dropzone onDrop={handleDrop} accept="image/*" >
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            <p>Drag'n'drop image, or click to select image</p>
                        </div>
                    )}
                </Dropzone>
                <div>
                    <strong>Files:</strong>
                    <ul>
                        {fileNames.map(fileName => (
                            <li key={fileName}>{fileName}</li>
                        ))}
                    </ul>
                    <div>Preview:</div>
                    {imageUrls.map(imageUrl => (
                        <img key={imageUrl} src={imageUrl} />
                    ))}
                </div>
                <Button type="submit" variant="contained" color="primary">
                    Post
                </Button>
            </form>
        </div >
    );
}