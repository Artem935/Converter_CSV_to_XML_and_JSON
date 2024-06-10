// src/App.js

import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import EventChart from '../components/EventChart';
import "../Style/MainPage.css"


const MainPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']); 
  const [eventData, setEventData] = useState([]);
  const decodedToken = jwtDecode(cookies.token);
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка CSV файла и парсинг данных
    Papa.parse('/significant_events.csv', {
      download: true,
      header: true,
      complete: (results) => {
        console.log(results.data)
        setEventData(results.data);
      },
    });
    console.log(eventData)
    console.log("Event data")
  }, []);

  useEffect(() => {
    if (cookies.token) {
      console.log('Decoded JWT Token:', decodedToken);
    } else {
      console.log('No token found in cookies.');
      navigate('/login');
    }
  }, [cookies]);
  const handleLogout = () => {
    removeCookie('token', { path: '/' });
    navigate('/login');
  };
  const downloadFile = () => {
    console.log("Click")
    window.location.href = 'https://drive.google.com/uc?export=download&id=10G3CdI7ZJoGPflbgfdJjGaQ7heZavJm2';
  };
  return (
    <div className="MainPage">
      <Header />
      <button onClick={handleLogout} className="LogoutButton">Logout</button>
      <input type="button" onClick={downloadFile} value="download data" />
      <a href="https://drive.google.com/uc?export=download&id=10G3CdI7ZJoGPflbgfdJjGaQ7heZavJm2">Скачать данные</a>
      {decodedToken && <p>Decoded Token: {JSON.stringify(decodedToken)}</p>}
      <EventChart data={eventData} />
      <MainContent />
      <Footer />
    </div>
  );
};

export default MainPage;
