import React from 'react'
import { StyledEngineProvider } from '@mui/material/styles';
import PersistentDrawerRight from './pages/mainBox/dashboard';
import SignIn from './pages/login';
import { Link, Route, Routes } from 'react-router-dom';
import "./App.css"
const App = () => {
  return (
    <>

      <StyledEngineProvider injectFirst>
        <PersistentDrawerRight />
      </StyledEngineProvider>
    </>
  )
}

export default App