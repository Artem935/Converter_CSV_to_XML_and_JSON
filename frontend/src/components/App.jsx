
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// import "../Style.css";    
import { CookiesProvider } from 'react-cookie';
import React, { useEffect, useState } from 'react';
import MainPage from "../pages/MainPage";
import Login from "../pages/Login";
import Registration from "../pages/Registration";

const App = () => {
  
  return (
    <div>
    <CookiesProvider>
        <Routes>     

          <Route path="" element={<MainPage  />} />
          <Route path="/login" element={<Login  />} />
          <Route path="/registration" element={<Registration  />} />
      </Routes>
    </CookiesProvider>
    </div>
  );
};

export default App;
