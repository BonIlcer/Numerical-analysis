import { createMuiTheme, CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    // primary: {
    //   main: blue[500],
    // },
    // background: {
    //   default: '#1f1f1f',
    //   paper: '#282828',
    // },
  },
  typography: {
    fontFamily: 'Roboto',
    fontWeightRegular: 300,
    fontSize: 16,
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <App />
      </CssBaseline>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
