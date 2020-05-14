import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from "../react-auth0-spa"

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: "60%",
        maxWidth: "60%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },

    avatar: {
        backgroundColor: red[500],
    },
}));

export default function SinglePostDetails({ location }) {
    //const postData = useRef({})
    const [postData, setPostData] = useState({})
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);


    const classes = useStyles();
    const { user, getTokenSilently } = useAuth0()

    useEffect(() => {
        const getPostDetails = async () => {
            //fetch post @ location.pathname
            const postDetailsRes = await fetch(`http://localhost:3001${location.pathname}`)
            const { post } = await postDetailsRes.json();
            //postData.current = post;
            setPostData(post)
            setUpvotes(post.Votes.filter(vote => vote.upVote).length)
            setDownvotes(post.Votes.filter(vote => vote.downVote).length)
        }
        getPostDetails();
    }, [location.pathname]);


    const upVoteHandler = async (e) => {
        if (user) {
            const token = await getTokenSilently();
            let res = await fetch(`http://localhost:3001/posts/${postData.id}/upvote`, {
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
            let res = await fetch(`http://localhost:3001/posts/${postData.id}/downvote`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: user.userId })
            });
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


    return (
        <div id="single-post-detail-car-container">
            < Card className={classes.root} >
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            R
          </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={postData.title}
                    subheader="September 14, 2016"
                />
                <CardMedia
                    component="img"
                    height='50%'
                    alt={postData.title}
                    image={postData.imageUrl}
                    title={postData.title}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {postData.description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton onClick={upVoteHandler}>
                        <KeyboardArrowUpIcon />
                        <Typography variant="subtitle1">{upvotes}</Typography>
                    </IconButton>
                    <IconButton onClick={downVoteHandler}>
                        <KeyboardArrowDownIcon />
                        <Typography variant="subtitle1">{-1 * downvotes}</Typography>
                    </IconButton>
                </CardActions>
            </Card >
        </div>
    );
}