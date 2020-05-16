import React from "react";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import ExternalApi from "./views/ExternalApi";
import NewPost from "./components/NewPost";
import SinglePostDetails from "./components/SinglePostDetails"

import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from "@material-ui/core/CssBaseline";
const myTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#f8f8ff',
    },
    secondary: {
      main: '#757575',
    },
    background: {
      default: "#DEE2FF"
    }
  },
})


function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <div className="App">
        <Router history={history}>
          <header>
            <NavBar />
          </header>
          <Switch>
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/external-api" component={ExternalApi} />
            <PrivateRoute exact path="/posts/new" component={NewPost} />
            <Route path="/posts/:id" component={SinglePostDetails} />
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;