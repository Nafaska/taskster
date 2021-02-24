import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";


import NotFound from "./components/404";
import TaskListPage from "./components/TaskListPage";
import StartPage from "./components/StartPage";

function App() {
  const history = createBrowserHistory();

  return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={() => <StartPage />} />
          <Route exact path="/:category" component={() => <TaskListPage />} />
          <Route
            exact
            path="/:category/:timespan"
            component={() => <TaskListPage />}
          />
          <Route component={() => <NotFound />} />
        </Switch>
      </Router>
  );
}

export default App;
