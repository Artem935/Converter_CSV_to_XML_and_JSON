// src/App.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import "../Style/Registration.css";
import ValidateEmail from "../js/Validator/ValidateEmail"
import ValidateLogin from "../js/Validator/ValidateLogin"
import ValidatePassword from "../js/Validator/ValidatePassword"
const Registration = () => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [IsCorrectLogin, setIsCorrectLogin] = useState(true);
  const [IsCorrecEmail, setIsCorrecEmail] = useState(true);
  const [IsCorrecPassword, setIsCorrecPassword] = useState(true);
  const [IsCorrecConfirmPassword, setIsCorrecConfirmPassword] = useState(true);

  const [isUnick, setIsUnick]  = useState(false);
  const handleLoginChange = (e) => {setLogin(e.target.value);};
  const handleEmailChange = (e) => {setEmail(e.target.value);};
  const handlePasswordChange = (e) => {setPassword(e.target.value);};
  const handleConfirmPasswordChange = (e) => {setConfirmPassword(e.target.value);};

  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    /////////// SQL

    try {
      const compareModel = {
        username: login,
        email: email
      };
      const response = await fetch('/compareRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(compareModel)
      });
      const data = await response.json();
      setIsUnick(data.massage)
      console.log(data.massage)
    } catch (error) {
      console.error('Помилка:', error);
    }
    /////////// SQL
    if(ValidateLogin(login)){setIsCorrectLogin(true)}
    else{setIsCorrectLogin(false)}

    if(ValidateEmail(email)){setIsCorrecEmail(true)}
    else{setIsCorrecEmail(false)}

    if(ValidatePassword(password)){setIsCorrecPassword(true)}
    else{setIsCorrecPassword(false)}

    if(password == confirmPassword && confirmPassword.length !== 0  ){setIsCorrecConfirmPassword(true)}
    else{setIsCorrecConfirmPassword(false)}
    
    
    if (isUnick){
      console.log(IsCorrecPassword )
      if (IsCorrectLogin && IsCorrecEmail && IsCorrecPassword && IsCorrecConfirmPassword) {
          /////////// SQL
          console.log("Success")
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const userModel = {
            username: login,
            email: email,
            password: hashPassword
          };
          console.log(userModel);
          navigate('/Login');
        try {
          const response = await fetch('/insertRegistration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userModel)
          });

          
        } catch (error) {
          console.error('Erore:', error);
        }
        /////////// SQL
      }
    }
    else{
      setIsCorrectLogin(false)
      setIsCorrecEmail(false)
    }
  };
  return (
    <div className="Registration">
        
        <div className="center-block">
            <input 
              className={`login ${IsCorrectLogin ? '' : 'Error'}`}
              type="text" 
              placeholder="Login"
              onChange={handleLoginChange}/>
            <input 
              className={`email ${IsCorrecEmail ? '' : 'Error'}`}
              type="text" 
              placeholder="Email"
              onChange={handleEmailChange}/>
            <input 
              className={`password ${IsCorrecPassword ? '' : 'Error'}`}
              type="password"
              placeholder="Password"
              onChange={handlePasswordChange}/>
            <input 
              className={`password ${IsCorrecConfirmPassword ? '' : 'Error'}`}
              type="password"
              placeholder="Repeat password"
              onChange={handleConfirmPasswordChange}/>
            <input 
              className='button-login' 
              type="button" 
              value={"Sing up"}
              onClick={handleSubmit}/>
            <p className='link'>Have account? <Link to="/login" className='link-registration'>Login</Link></p>
        </div>
    </div>
  );
};

export default Registration;
