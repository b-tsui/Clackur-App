import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa"
import SinglePost from "./SinglePost"

const Home = () => {
    const [posts, setPosts] = useState([]);

    const { loading, user, getTokenSilently } = useAuth0();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                //const token = await getTokenSilently();
                const res = await fetch('http://localhost:3001/posts')
                const { posts } = await res.json();
                setPosts(posts)
            } catch (error) {
                console.error(error);
            }
        }
        loadPosts();
    }, [getTokenSilently])
    console.log(posts)

    if (!user) {
        return <div className="posts-container">{posts.map((post) => <SinglePost post={post} />)}</div>

    } else {

        return (
            <>
                {/* <div>{JSON.stringify(user)}</div> */}
                <div className="home-welcome">Welcome, {user.name}</div>
                <div className="posts-container">{posts.map((post) => <SinglePost post={post} />)}</div>
            </>
        );
    }
};

export default Home;