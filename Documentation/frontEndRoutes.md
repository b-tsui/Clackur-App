* '/' (Main Page)
  * Main page displays all the image posts
    * Shows image title
    * Includes up/downvoting on posts
  * Displays login/signup is user is not logged it
  * Diplays profile name/avatar if user is logged in
* '/login' (Profile)
  * Taken care of by Auth0 Service
  * Displays login page
* '/posts/:id' (Post Details)
  * Displays post at larger resolution
  * Includes post description
  * Includes post author
  * Includes post timestamp
  * Includes up/downvoting
* '/profile' (User Profile);
  * Displays User Avatar
  * Displays User info
  * Displays User posts