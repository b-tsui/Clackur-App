import React, { useState } from "react";

import Dropzone from "react-dropzone";

export default function App() {
    const [fileNames, setFileNames] = useState([]);
    const [imageUrls, setImageUrls] = useState([])
    const handleDrop = acceptedFiles => {
        setFileNames(acceptedFiles.map(file => file.name));
        setImageUrls(acceptedFiles.map(file => URL.createObjectURL(file)))
    }

    return (
        <div className="App">
            <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>Drag'n'drop files, or click to select files</p>
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
        </div>
    );
}