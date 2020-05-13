
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'

import '../styles/navbar-styles.css'

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
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" className={classes.title}>
                        <a href="/">Clackur</a>
                    </Typography>
                    {isAuthenticated && (
                        <>
                            <Link to='/'>
                                <Button>Home</ Button>
                            </Link>
                            <Link to="/posts/new" ><Button>New Post</Button></Link>
                            <Link to="/profile"><Button>Profile</Button></Link>
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
