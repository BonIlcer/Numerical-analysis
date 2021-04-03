import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Lab1 from './pages/Lab1'
import Lab2 from './pages/Lab2'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/'>
          <Redirect push to='/lab1' />
        </Route>
        <Route path='/lab1'>
          <Lab1 />
        </Route>
        <Route path='/lab2'>
          <Lab2 />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
