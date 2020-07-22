import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import GitHubIcon from "@material-ui/icons/GitHub";

import "../styles/navbar-styles.css";

import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <div className="navbar-left">
              <a href="/" id="navbar-logo">
                <img
                  alt="clackur logo"
                  src="https://clackurbucket.s3.us-east-2.amazonaws.com/1589431160842"
                  height="40"
                  width="40"
                />
                &nbsp;lackur
              </a>
              <a href="https://github.com/b-tsui" target="_blank">
                <GitHubIcon />
              </a>
            </div>
          </Typography>
          {isAuthenticated && (
            <>
              <Link to="/">
                <Button>Home</Button>
              </Link>
              <Link to="/posts/new">
                <Button>New Post</Button>
              </Link>
              <Link to="/profile">
                <Button>Profile</Button>
              </Link>
              {/* <Link to="/external-api">External API</Link> */}
            </>
          )}
          {!isAuthenticated && (
            <Button onClick={() => loginWithRedirect({})}>Log in</Button>
          )}
          {isAuthenticated && <Button onClick={() => logout()}>Log out</Button>}
        </Toolbar>
      </AppBar>
    </div>
  );
}
