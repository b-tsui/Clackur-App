import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa"
import SinglePost from "./SinglePost"
import '../styles/home-page.css'
import Loading from "./Loading"

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { user } = useAuth0();

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true)
        }, 3500)

        const loadPosts = async () => {
            try {
                const res = await fetch(`https://clackur-backend.herokuapp.com/posts`)
                const { posts } = await res.json();
                setPosts(posts)
            } catch (error) {
                console.error(error);
            }
        }
        loadPosts();

    }, [])

    if (!user) {
        return (
            <>
                {!loaded &&
                    <Loading />
                }
                {loaded &&
                    <>
                        < div className="posts-container" >
                            {posts.map((post) => <SinglePost post={post} key={post.id} />)}
                        </div >
                    </>
                }
            </>
        )

    } else {

        return (
            <>
                {!loaded &&
                    <Loading />
                }
                {loaded &&
                    <>
                        <div className="home-welcome">Welcome, {user.name}</div>
                        <div className="posts-container">{posts.map((post) => <SinglePost post={post} key={post.id} />)}</div>
                    </>
                }
            </>
        );
    }
};

export default Home;