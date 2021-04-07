import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Lab1 from './pages/Lab1'
import Lab2 from './pages/Lab2'
import Lab3 from './pages/Lab3'
import Lab4 from './pages/Lab4'
import Lab5 from './pages/Lab5'
import Navbar from './components/Navbar'
import { Box } from '@material-ui/core'

function App() {
  return (
    <Router>
      <Navbar />
      <Box display='flex' justifyContent='space-between' flexDirection='column' minHeight='100vh'>
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
          <Route path='/lab3'>
            <Lab3 />
          </Route>
          <Route path='/lab4'>
            <Lab4 />
          </Route>
          <Route path='/lab5'>
            <Lab5 />
          </Route>
        </Switch>
        <Box align='right' p={2} pb={1}>
          Evgeny Pantaev
        </Box>
      </Box>
    </Router>
  )
}

export default App
