
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()


 axios.defaults.withCredentials = true;
  const handelSubmit = (e) =>{
      e.preventDefault()
      axios.post('http://localhost:3001/login',{ email, password})
      .then(res =>{
         if(res.data.Login){
          navigate("/dashboard")
         } else{
          navigate('/')
         }
       
      })
      .catch(err => console.log(err))
  }
  return (
    <div>
       <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Login</h2>
        <form onSubmit={handelSubmit}>

          <div className='mb-3'>
            <label htmlFor='email'>
             <strong>email</strong>
            </label>
            <input
              type='email'
              placeholder='enter Email'
              autoComplete='off'
              name='email'
              className='form-control rounded-0'
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='email'>
             <strong>Password</strong>
            </label>
            <input
              type='password'
              placeholder='enter Password'
              autoComplete='off'
              name='Password'
              className='form-control rounded-0'
              onChange={(e)=> setPassword(e.target.value)}
            />
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'>Login</button>
        </form>
        <p>Don't have an Account</p>
        <button className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
          register
        </button>
      </div>
    </div>
    </div>
  )
}

export default Login
