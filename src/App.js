import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Container from "@material-ui/core/Container";
import Sidebar from './components/Sidebar'
import Home from './Home';
import { View } from './components/View';
import Edit from './components/Edit';


function App() {
  return (
    <Container>
      <Sidebar/>
      <Router>
        <Switch>
          <Route path exact='/' component={Home}/>
          <Route path="/edit/:id" render={(props) => <Edit id={props.match.params.id}/>}/>
          <Route path='/view/:id' render={(props) => <View id={props.match.params.id}/>}/>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
