import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateGrave from './components/CreateGrave';
import App from './App';

const Routers = () => {
  return (
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/create_grave" element={<CreateGrave />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
  )
}

export default Routers
