import React, { useState, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dropzone from "react-dropzone";
import Paper from '@material-ui/core/Paper';
import { useAuth0 } from "../react-auth0-spa";
import '../styles/new-post-page.css'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            minWidth: 400,
            width: '60vw',
            background: '#FAF5FB'
        },
    },
    form: {
        width: '60vw'
    }
}));

export default function App() {
    const [fileNames, setFileNames] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('')

    //keeps image data from uploaded image current
    //must use .current to get the current state var
    const imageData = useRef(new FormData());

    //gets token geterator and user info from Auth0
    const { user, getTokenSilently } = useAuth0();

    //for material ui
    const classes = useStyles();

    //adds dragndropped photo to image data and sets vars for image preview
    const handleDrop = async (acceptedFiles) => {

        imageData.current.set(`file`, acceptedFiles[0]);

        setFileNames(acceptedFiles.map(file => file.name));
        //sets temp image url in state for photo preview
        setImageUrls(acceptedFiles.map(file => URL.createObjectURL(file)));

    }

    //updates state with form field values as they're being typed
    const handleFormTitle = (e) => setPostTitle(e.target.value);
    const handleFormDescription = (e) => setPostDescription(e.target.value);

    /**/
    const handlePostSubmit = async (e) => {
        e.preventDefault();

        //makes sure a photo was uploaded
        if (imageUrls.length === 0) {
            alert('please upload a photo');
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
        });
        const imageResData = await imageRes.json();

        const postRes = await fetch('http://localhost:3001/posts/new', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                categoryId: 1,
                userId: user.userId,
                title: postTitle,
                description: postDescription,
                imageUrl: imageResData.imageUrl,
                public: true
            })
        });
        if (postRes.ok) {
            window.location.href = '/'
        }

    }

    return (
        <div id="new-post-form-container" onSubmit={handlePostSubmit} >
            <Paper>
                <form className={`${classes.root} new-post-form`} autoComplete="off">
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


                    {/* dropzone component comes from react-dropzone
                and allows client to drag/drop or upload an image to post */}
                    <Paper className="drop-zone">
                        <Dropzone onDrop={handleDrop} accept="image/*" >
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps({ className: "dropzone" })}>
                                    <input {...getInputProps()} />
                                    <p style={{ padding: "10px" }} >Drag/drop image, or click to select image</p>
                                </div>
                            )}
                        </Dropzone>
                    </Paper>
                    <div>
                        File: {fileNames.map(fileName => (
                        <li key={fileName}>{fileName}</li>
                    ))}

                        <div>Preview:</div>
                        {imageUrls.map(imageUrl => (
                            <img alt={postTitle} key={imageUrl} src={imageUrl} width="100%" />
                        ))}
                    </div>
                    <Button type="submit" variant="contained" color="primary">
                        Post
                </Button>
                </form>
            </Paper>
        </div >
    );
}