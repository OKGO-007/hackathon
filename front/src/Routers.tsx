import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateGrave from './components/CreateGrave';
import App from './App';
import CharacterSearch from './components/CharacterSearch';
import ApiProvider from "./context/AnimeApi"
import SignUp from './components/Singup';
import Login from './components/Login';
import MyListGrave from './components/MyListGrave';

import { GraveProvider } from './context/GraveContext';


const Routers = () => {
  return (
    <React.StrictMode>
      <GraveProvider>
        <ApiProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/create_grave" element={<CreateGrave />} />
                  <Route path="/character_search" element={<CharacterSearch />} />
                  <Route path="/mylist_grave" element={<MyListGrave />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/singup" element={<SignUp />} />
              </Routes>
          </BrowserRouter>
        </ApiProvider>
      </GraveProvider> 
    </React.StrictMode>
  )
}

export default Routers
