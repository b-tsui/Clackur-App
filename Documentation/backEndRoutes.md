*users
    *POST '/users/register' => creates a new user
    *PATCH '/users/login' => updates a users info
*posts
    *GET '/posts' => returns list of all posts with vote data
    *GET '/posts/:id' => returns data for post at specified id
    *GET '/posts/user/:id => returns all posts with vote data for specified user
    *POST '/posts/image/upload' => uploads image from form data to aws and return image url
    *POST '/posts/new' => creates a new post with image url
    *PATCH 'posts/:id/upvote => creates upvote if user has not voted on post, deletes vote if user previously upvoted and switched to upvote if user previously downvoted
    *PATCH 'posts/:id/upvote => create downvote if user has not voted on post, deletes vote if user previously downvoted and switch to downvote if user previously downvoted
    