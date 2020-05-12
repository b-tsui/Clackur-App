import React from "react"

const SinglePost = ({ post }) => {
    //add a fetch on users get with post id to get post name
    return (
        <div className="post-container">
            <div className="post-title">{post.title}</div>
            <div className="post-author">By {post.userId}</div>
            <div className="post-description">Description: {post.description}</div>
            <img alt={post.title} src={post.imageUrl} />

        </div>
    )
}

export default SinglePost