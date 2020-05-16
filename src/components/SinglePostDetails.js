import React, { useState, useEffect } from 'react';
import { useAuth0 } from "../react-auth0-spa"
import '../styles/post-details.css'
import { api } from "../config"
import Loading from "./Loading"
import SingleComment from "./SingleComment"

import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';


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
        color: '#212121',
        height: 60,
        width: 60
    },
    commentAvatar: {
        color: '#212121',
        height: 30,
        width: 30,
        marginRight: 26
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function SinglePostDetails({ location }) {

    const [postData, setPostData] = useState({})
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [comments, setComments] = useState([])
    const [expanded, setExpanded] = React.useState(false);
    const [typedComment, setTypedComment] = useState('')

    useEffect(() => {
        const loadComments = async () => {
            const postCommentsRes = await fetch(`${api}${location.pathname}/comments`)
            const { comments } = await postCommentsRes.json();
            setComments(comments)
        }
        loadComments();
    }, [location.pathname])

    const classes = useStyles();
    const { user, getTokenSilently } = useAuth0()

    //For expanding comments
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    //gets post details
    useEffect(() => {
        const getPostDetails = async () => {
            //fetch post @ location.pathname
            const postDetailsRes = await fetch(`${api}${location.pathname}`)
            const { post } = await postDetailsRes.json();
            //postData.current = post;
            setPostData(post)
            setUpvotes(post.Votes.filter(vote => vote.upVote).length)
            setDownvotes(post.Votes.filter(vote => vote.downVote).length)
        }
        getPostDetails();
    }, [location.pathname]);

    //handles upvoting
    const upVoteHandler = async (e) => {
        if (user) {
            const token = await getTokenSilently();
            let res = await fetch(`${api}/posts/${postData.id}/upvote`, {
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
    //handles downvoting
    const downVoteHandler = async (e) => {
        if (user) {
            const token = await getTokenSilently();
            let res = await fetch(`${api}/posts/${postData.id}/downvote`, {
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

    const handleCommentInput = (e) => setTypedComment(e.target.value)
    //posts comment
    const handleCommentEnter = async (e) => {
        if (e.key === "Enter") {

            const token = await getTokenSilently();
            const commentRes = await fetch(`${api}${location.pathname}/comments/new`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comment: typedComment
                })
            })
            if (commentRes.ok) {
                setTypedComment('');
                const newComment = await commentRes.json();
                console.log(newComment)
            }
        }
    }

    if (!postData.User) {
        return <Loading />
    }
    return (
        <div id="single-post-detail-card-container">
            < Card className={classes.root} >
                <CardHeader
                    avatar={
                        <Avatar aria-label="user avatar" className={classes.avatar}>
                            {/* turns first two letters of users name to avatar */}
                            {postData.User.name.slice(0, 2)}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={
                        <Typography variant="h5" component="h2">
                            {postData.title}
                        </Typography>
                    }
                    subheader={
                        <>
                            <div>by {postData.User.name}</div>
                            <div>{Date(postData.createdAt)}</div>
                        </>
                    }
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
                    Comments
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Comments:</Typography>
                        <List >
                            {comments.map((comment) => <SingleComment comment={comment} key={comment.id} />)}
                            {user && <div className="comment-input-container">
                                <Avatar aria-label="user avatar" className={classes.commentAvatar}>
                                    {/* turns first two letters of users name to avatar */}
                                    {user.name.slice(0, 2)}
                                </Avatar>
                                <TextField
                                    color='secondary'
                                    label='Add a comment!'
                                    style={{ width: '100%' }}
                                    onChange={handleCommentInput}
                                    onKeyPress={handleCommentEnter}
                                    value={typedComment}
                                />
                            </div>}
                        </List>
                    </CardContent>
                </Collapse>
            </Card >
        </div >
    );
}