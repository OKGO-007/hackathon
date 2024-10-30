import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom";
import SubmitTest from './components/SubmitTest';
// import CreateGrave from './components/CreateGrave';
import Header from './components/Header';

import Button from '@mui/material/Button';

function App() {
  return (
    <div >
      <Header />
      <SubmitTest />
      <Button component={Link} to="/create_grave" >Clicke</Button>
    </div>
  );
}

export default App;
