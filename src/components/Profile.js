// src/components/Profile.js

import React, { Fragment, useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa";
import MyPosts from './MyPosts'
import SinglePost from "./SinglePost"

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const { loading, user } = useAuth0();

    // useEffect(() => {
    //     if (user) {
    //         const loadPosts = async () => {
    //             try {
    //                 const res = await fetch(`http://localhost:3001/posts/user/${user.userId}`)
    //                 const { posts } = await res.json();
    //                 setPosts(posts)
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         }
    //         loadPosts();
    //     }
    // }, [user])

    if (loading || !user) {
        return <div>Loading...</div>;
    }
    // } else if (!posts) {
    //     return (
    //         <Fragment>
    //             <img src={user.picture} alt="Profile" />
    //             <h2>{user.name}</h2>
    //             <p>{user.email}</p>
    //             <div>no posts yet</div>
    //         </Fragment>
    //     )
    // }

    return (
        <Fragment>
            <img src={user.picture} alt="Profile" />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {/* <div className="posts-container">{posts.map((post) => <SinglePost post={post} key={post.id} />)}</div> */}
            <MyPosts />
        </Fragment>
    );
};

export default Profile;