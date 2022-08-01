import { useState } from 'react';
import ListComponent from './components/ListComponent'
import Login from './components/Login'
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {
  const [loggedin, setLoggedin] = useState(false)
  
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {loggedin ? <ListComponent setLoggedin={setLoggedin}/> : <Login setLoggedin={setLoggedin}/>}
    </ThemeProvider>
  );
}

export default App;
