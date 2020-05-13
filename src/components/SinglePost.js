import React, { useState, useEffect } from 'react';
import { useAuth0 } from "../react-auth0-spa"

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});

export default function SinglePost({ post }) {
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0)

    const { user, getTokenSilently } = useAuth0()
    const classes = useStyles();

    let numUpvotes = (post.Votes.filter(vote => vote.upVote));
    let numDownvotes = (post.Votes.filter(vote => vote.downVote));
    useEffect(() => {
    })

    const upVoteHandler = (e) => {

    }

    const downVoteHandler = (e) => {

    }


    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt={post.title}
                    height="180"
                    image={post.imageUrl}
                    title={post.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {post.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <IconButton>
                    <KeyboardArrowUpIcon />
                    <Typography variant="subtitle1">{numUpvotes.length}</Typography>
                </IconButton>
                <IconButton>
                    <KeyboardArrowDownIcon />
                    <Typography variant="subtitle1">{numDownvotes.length}</Typography>
                </IconButton>
            </CardActions>
        </Card>
    );
}
