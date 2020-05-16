import React from 'react'


import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    avatar: {
        color: '#212121',
        height: 30,
        width: 30

    },
}));

export default function SingleComment({ comment }) {
    const classes = useStyles();

    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar aria-label="user avatar" className={classes.avatar}>
                        {/* turns first two letters of users name to avatar */}
                        {comment.User.name.slice(0, 2)}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={comment.comment}
                    secondary={
                        <React.Fragment>
                            {/* <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                :{comment.User.name}
                            </Typography> */}
                            by <strong>{comment.User.name}</strong> - {Date(comment.createdAt)}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    )
}