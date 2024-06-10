// src/App.js
import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

import "../Style/Login.css";


const Login = () => {
  const [cookies, setCookie] = useCookies(['token']);
  const [chek, setChek] = useState(true);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = (e) => {setLogin(e.target.value);};
  const handlePasswordChange = (e) => {setPassword(e.target.value);};
  const navigate = useNavigate();

  const handleGetQuery = async () => {
    try {
      const compareModel = {
        username: login
      };
      const response = await fetch('/compareLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(compareModel)
      });
      const data = await response.json();
      console.log(data.password)
      if(data.password != "empty")
      {
        const passwordsMatch = await bcrypt.compare(password, data.password);
        if(passwordsMatch)
        {
          setCookie('token', data.token, { path: '/' });
          const decodedToken = jwtDecode(data.token);
          console.log('Decoded Token:', decodedToken);
          console.log("Complete")
          
          // setCookie('myCookie', {username: login,password: password, isLogin: true}, { path: '/' });
          navigate('/');
        }
        else
        {
          setChek(false)
        }
      }
      else
      {
        setChek(false)
      }

    } catch (error) {
      console.error('Помилка:', error);
    }

  };
  return (
    <div className="Login">
        
        <div className="center-block">
            <input 
            className={`login ${chek ? '' : 'Error'}`}
            type="text" 
            placeholder="Login"
            onChange={handleLoginChange}  />
            <input 
            className={`password ${chek ? '' : 'Error'}`}
            type="password" 
            placeholder="Password"
            onChange={handlePasswordChange}  />
            <input 
            className='button-login' 
            type="button" 
            value={"Login"}
            onClick={handleGetQuery}/>
            <p className='link'>Don't have account? <Link to="/registration" className='link-registration'  >Sing up</Link></p>
        </div>
    </div>
  );
};

export default Login;
