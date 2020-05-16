import React, { useState } from 'react';
import { useAuth0 } from "../react-auth0-spa"
import { Link } from "react-router-dom"
import { api } from "../config"


import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        background: '#FAF5FB',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },

}));

export default function SinglePost({ post }) {
    const [upvotes, setUpvotes] = useState(post.Votes.filter(vote => vote.upVote).length);
    const [downvotes, setDownvotes] = useState(post.Votes.filter(vote => vote.downVote).length);
    const [loaded, setLoaded] = useState(false)


    const { user, getTokenSilently } = useAuth0()
    const classes = useStyles();

    const upVoteHandler = async (e) => {
        if (user) {
            const token = await getTokenSilently();
            debugger
            let res = await fetch(`${api}/posts/${post.id}/upvote`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: user.userId })
            });
            //sets local state so front end displays the votes dynamically
            if (res.status === 204) {
                setUpvotes(upvotes - 1);
            }
            if (res.status === 201) {
                setUpvotes(upvotes + 1);
            }
            if (res.status === 206) {
                setUpvotes(upvotes + 1);
                setDownvotes(downvotes - 1);
            }
        } else {
            return;
        }
    }
    const downVoteHandler = async (e) => {
        if (user) {
            const token = await getTokenSilently();
            let res = await fetch(`${api}/posts/${post.id}/downvote`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: user.userId })
            });
            //sets local state so front end displays the votes dynamically
            if (res.status === 204) {
                setDownvotes(downvotes - 1);
            }
            if (res.status === 201) {
                setDownvotes(downvotes + 1);
            }
            if (res.status === 206) {
                setDownvotes(downvotes + 1);
                setUpvotes(upvotes - 1);
            }
        } else {
            return;
        }
    }
    const handleLoad = () => {
        //timeout to make the placeholder image last a little longer and look smoother
        setTimeout(() => {
            setLoaded(true)
        }, 1150)
    }


    return (
        <Card className={classes.root} style={{ margin: '10px' }}>
            <Link to={{
                pathname: `/posts/${post.id}`,
                post
            }} >
                <CardActionArea >
                    <img
                        //style={loaded ? {} : { display: "none" }}
                        component="img"
                        alt={post.title}
                        height="250"
                        //src={post.imageUrl}
                        //displays placeholder gif while actuall images load
                        src={loaded ? post.imageUrl : 'https://deskthority.net/wiki/images/2/25/Mx_clear_illustration.gif'}
                        title={post.title}
                        //sets loaded to true after timeout
                        onLoad={handleLoad}
                    />
                    <div style={{ margin: '5px 12px 0px' }}>
                        <div style={{ fontSize: '1.1rem' }}>
                            {post.title}
                        </div>
                    </div>
                </CardActionArea>
            </Link>
            <CardActions style={{ padding: '3px' }}>
                <IconButton onClick={upVoteHandler} style={{ padding: '5px' }}>
                    <KeyboardArrowUpIcon />
                    <Typography variant="subtitle1">{upvotes}</Typography>
                </IconButton>
                <IconButton onClick={downVoteHandler} style={{ padding: '5px' }}>
                    <KeyboardArrowDownIcon />
                    <Typography variant="subtitle1">{-1 * downvotes}</Typography>
                </IconButton>
            </CardActions>
        </Card >
    );
}
