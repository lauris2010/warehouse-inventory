import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Home from "./Home";
import View from "./components/View";
import Edit from "./components/Edit";
import AddItem from "./components/AddItem";
import Sidebar from "./components/Sidebar";



function App() {
  return (
    <Container>
      <Router>
        <div>
          <Sidebar/>
          <Switch>
            <Route path exact="/" component={Home} />
            <Route
              path="/edit/:id"
              render={(props) => <Edit id={props.match.params.id} />}
            />
            <Route
              path="/view/:id"
              render={(props) => <View id={props.match.params.id} />}
            />
            <Route
              path="/add"
              render={(props) => <AddItem id={props.match.params.id} />}
            />
          </Switch>
        </div>
      </Router>
    </Container>
  );
}

export default App;
