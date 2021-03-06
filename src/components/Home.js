import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa";
import SinglePost from "./SinglePost";
import "../styles/home-page.css";
import Loading from "./Loading";
import { api } from "../config";
import Button from "@material-ui/core/Button";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { user, loginWithRedirect } = useAuth0();

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 2000);

    const loadPosts = async () => {
      const res = await fetch(`${api}/posts`);
      const { posts } = await res.json();
      setPosts(posts);
    };
    loadPosts();
  }, []);

  if (user) {
    return (
      <>
        {!loaded && <Loading />}
        {loaded && (
          <>
            <h1 className="home-welcome">Welcome, {user.name}</h1>
            <div className="posts-container">
              {posts.map((post) => (
                <SinglePost post={post} key={post.id} />
              ))}
            </div>
          </>
        )}
      </>
    );
  } else {
    return (
      <>
        {!loaded && <Loading />}
        {loaded && (
          <>
            <h1 className="home-welcome">Welcome to Clackur!</h1>
            <div className="home-welcome-message">
              <div>
                Clackur is an image sharing app for mechanical keyboard
                enthusiasts by keyboard enthusiasts.
              </div>
              <div>
                Experience all the features clackur has to offer by logging in,
                signing up, or using the demo login!
              </div>
              <div>
                <Button
                  id="home-welcome-demo-button"
                  onClick={() => loginWithRedirect({})}
                >
                  Log in / Demo
                </Button>
              </div>
            </div>
            <div className="posts-container">
              {loaded &&
                posts.map((post) => <SinglePost post={post} key={post.id} />)}
            </div>
          </>
        )}
      </>
    );
  }
};

export default Home;
