import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa"
import SinglePost from "./SinglePost"
import Loading from "./Loading"
import '../styles/home-page.css'

const Home = () => {
    const [posts, setPosts] = useState([]);

    const { user, loading } = useAuth0();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const res = await fetch('http://localhost:3001/posts')
                const { posts } = await res.json();
                setPosts(posts)
            } catch (error) {
                console.error(error);
            }
        }
        loadPosts();
    }, [])

    if (!user) {
        return <div className="posts-container">{posts.map((post) => <SinglePost post={post} key={post.id} />)}</div>

    } else {
        if (loading) {
            return <div>loading here</div>
        }
        return (
            <>
                {/* <div>{JSON.stringify(user)}</div> */}
                <div className="home-welcome">Welcome, {user.name}</div>
                <div className="posts-container">{posts.map((post) => <SinglePost post={post} key={post.id} />)}</div>
            </>
        );
    }
};

export default Home;