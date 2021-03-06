import React, { Fragment, useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa";
import SinglePost from "./SinglePost"
import '../styles/user-info.css'
import { api } from "../config"

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const { loading, user } = useAuth0();
    debugger;
    useEffect(() => {
        if (user) {
            const loadPosts = async () => {
                try {
                    const res = await fetch(`${api}/posts/user/${user.userId}`)
                    const { posts } = await res.json();
                    setPosts(posts)
                } catch (error) {
                    console.error(error);
                }
            }
            loadPosts();
        }
    }, [user])

    if (loading || !user) {
        return <div>Loading...</div>;
    }
    return (
        <Fragment>
            <div className="user-info-container">
                <img src={user.picture} alt="Profile" width="120" height="120" style={{ 'border-radius': '50%' }} />
                <h3>{user.name}</h3>
                <h1>My Posts</h1>
                {/* <p>{user.email}</p> */}
            </div>
            <div className="posts-container">{posts.map((post) => <SinglePost post={post} key={post.id} />)}</div>
        </Fragment>
    );
};

export default Profile;