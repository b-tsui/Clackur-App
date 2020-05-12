// src/components/NavBar.js

// import React from "react";
// import { useAuth0 } from "../react-auth0-spa";
// import { Link } from "react-router-dom";

// const NavBar = () => {
//     const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

//     return (
//         <div>
//             {!isAuthenticated && (
//                 <button onClick={() => loginWithRedirect({})}>Log in</button>
//             )}
//             {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
//             {isAuthenticated && (
//                 <span>
//                     <Link to="/">Home</Link>
//                     <Link to="/profile">Profile</Link>
//                     <Link to="/external-api">External API</Link>
//                 </span>
//             )}
//         </div>
//     );
// };

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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
                        <Link to='/'><Button>Clackur</ Button></Link>
                    </Typography>
                    {isAuthenticated && (
                        <>
                            <Link to="/posts/new"><Button>New Post</Button></Link>
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
