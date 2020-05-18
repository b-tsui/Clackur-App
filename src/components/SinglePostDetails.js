import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "../react-auth0-spa"
import '../styles/post-details.css'
import { api } from "../config"
import Loading from "./Loading"
import SingleComment from "./SingleComment"
import SinglePostDetailsOptions from "./SinglePostDetailsOptions"

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
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CommentIcon from '@material-ui/icons/Comment';
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

//location passed in comes from default props passed in
export default function SinglePostDetails({ location }) {

    const [postData, setPostData] = useState({})
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [comments, setComments] = useState([])
    const [expanded, setExpanded] = React.useState(false);
    const [typedComment, setTypedComment] = useState('')
    const postD = useRef({})

    const classes = useStyles();
    const { user, getTokenSilently } = useAuth0()

    //gets comment info
    useEffect(() => {
        const loadComments = async () => {
            const postCommentsRes = await fetch(`${api}${location.pathname}/comments`)
            const { comments } = await postCommentsRes.json();
            setComments(comments)
        }
        loadComments();
    }, [location.pathname])

    //gets post details
    useEffect(() => {
        const getPostDetails = async () => {
            //fetch post @ location.pathname
            const postDetailsRes = await fetch(`${api}${location.pathname}`)


            const { post } = await postDetailsRes.json();
            if (!post) {
                return (<div>rip</div>)
            }
            postD.current = post;
            setPostData(post)
            setUpvotes(post.Votes.filter(vote => vote.upVote).length)
            setDownvotes(post.Votes.filter(vote => vote.downVote).length)
            //sets clients vote state
            if (user) {
                postD.current.Votes.forEach(vote => {
                    if (vote.userId === user.userId) {
                        if (vote.upVote) {
                            setUpvoted(true)
                        } else if (vote.downVote) {
                            setDownvoted(true)
                        }

                    }
                })
            }
        }
        getPostDetails();
    }, [location.pathname, user]);



    //For expanding comments
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


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
                setUpvoted(false);
            }
            if (res.status === 201) {
                setUpvotes(upvotes + 1);
                setUpvoted(true);
            }
            if (res.status === 206) {
                setUpvotes(upvotes + 1);
                setDownvotes(downvotes - 1);
                setUpvoted(true);
                setDownvoted(false);
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
            //sets local state so front end displays the votes dynamically
            if (res.status === 204) {
                setDownvotes(downvotes - 1);
                setDownvoted(false);
            }
            if (res.status === 201) {
                setDownvotes(downvotes + 1);
                setDownvoted(true);
            }
            if (res.status === 206) {
                setDownvotes(downvotes + 1);
                setUpvotes(upvotes - 1);
                setDownvoted(true);
                setUpvoted(false);
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
                let { newComment } = await commentRes.json();

                /*creates a new comment object to add to comment array to 
                render new comment dynamically for client*/
                newComment = {
                    ...newComment,
                    "User": {
                        "id": user.userId,
                        "email": user.email,
                        "name": user.nickname
                    }
                }
                setComments([...comments, newComment])
            }
        }
    }
    // if (!postData) {
    //     return <Loading />
    // }

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
                        <SinglePostDetailsOptions location={location} />
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
                    {upvoted &&
                        <IconButton onClick={upVoteHandler} style={{ padding: '5px', color: 'rgb(0,0,255,.6)' }}>
                            <KeyboardArrowUpIcon />
                            <Typography variant="subtitle1">{upvotes}</Typography>
                        </IconButton>
                    }
                    {!upvoted &&
                        <IconButton onClick={upVoteHandler} style={{ padding: '5px' }}>
                            <KeyboardArrowUpIcon />
                            <Typography variant="subtitle1">{upvotes}</Typography>
                        </IconButton>
                    }
                    {downvoted &&
                        <IconButton onClick={downVoteHandler} style={{ padding: '5px', color: "rgb(255,0,0,.6)" }}>
                            <KeyboardArrowDownIcon />
                            <Typography variant="subtitle1">{-1 * downvotes}</Typography>
                        </IconButton>
                    }
                    {!downvoted &&
                        <IconButton onClick={downVoteHandler} style={{ padding: '5px' }}>
                            <KeyboardArrowDownIcon />
                            <Typography variant="subtitle1">{-1 * downvotes}</Typography>
                        </IconButton>
                    }
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <CommentIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Comments:</Typography>
                        <List >
                            {/* created comment component for each comment */}
                            {comments.map((comment) => <SingleComment comment={comment} key={comment.id} />)}
                            {/* displays comment input if user is logged in */}
                            {user &&
                                <div className="comment-input-container">
                                    <Avatar aria-label="user avatar" className={classes.commentAvatar}>
                                        {/* turns first two letters of users name to avatar */}
                                        {user.nickname.slice(0, 2)}
                                    </Avatar>
                                    <TextField
                                        color='secondary'
                                        label='Add a comment!'
                                        style={{ width: '100%' }}
                                        onChange={handleCommentInput}
                                        onKeyPress={handleCommentEnter}
                                        value={typedComment}
                                    />
                                </div>
                            }
                            {!user &&
                                <div className="comment-input-container">
                                    <Avatar aria-label="user avatar" className={classes.commentAvatar}>
                                        ?
                                    </Avatar>
                                    <TextField
                                        disabled id="standard-disabled"
                                        label="Disabled"
                                        style={{ width: '100%' }}
                                        defaultValue="Log in to add a comment!"
                                    />
                                </div>
                            }
                        </List>
                    </CardContent>
                </Collapse>
            </Card >
        </div >
    );
}