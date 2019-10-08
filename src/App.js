import React from 'react';
import './App.css';

import { Container} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import FormSettings from './components/form/Form';


const App = () => {

  return (

    <Container maxWidth='md'>
      <Paper style={{padding:'20px 40px'}}>
      <FormSettings />
    </Paper>
    </Container>
  );
}


export default App;
