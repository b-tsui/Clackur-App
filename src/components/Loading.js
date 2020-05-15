import React from 'react';
import '../styles/loading-page.css'
export default function Loading() {
    return (
        <>
            <div className="loading-images">
                <img alt="mxclear" src='https://deskthority.net/wiki/images/2/25/Mx_clear_illustration.gif' className="img-responsive" />
                <img alt="mxblue" src='https://deskthority.net/wiki/images/0/02/Mx_blue_illustration.gif' className="img-responsive" />
                <img alt="mxred" src='https://deskthority.net/wiki/images/3/3a/Mx_red_illustration.gif' className="img-responsive" />
            </div>
            <h2 className="loading-text">Loading...</h2>
        </>
    )
}