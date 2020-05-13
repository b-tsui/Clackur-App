import React from "react";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import ExternalApi from "./views/ExternalApi";
import NewPost from "./components/NewPost";

import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
const myTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#7986cb',
    },
    secondary: {
      main: '#64b5f6',
    },
  },
})


function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <div className="App">
        {/* Don't forget to include the history module */}
        <Router history={history}>
          <header>
            <NavBar />
          </header>
          <Switch>
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/external-api" component={ExternalApi} />
            <PrivateRoute path="/posts/new" component={NewPost} />
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;