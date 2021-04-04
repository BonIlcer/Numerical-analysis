import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Lab1 from './pages/Lab1'
import Lab2 from './pages/Lab2'
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
        </Switch>
        <Box align='right' p={2} pb={1}>
          Evgeny Pantaev
        </Box>
      </Box>
    </Router>
  )
}

export default App
