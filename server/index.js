import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";
import StudentModel from './models/Student.js'


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))

mongoose.connect('mongodb://127.0.0.1:27017/school')

app.post('/register', (req, res)=>{
  const {name, email, password} = req.body;
  StudentModel.create({name, email, password})
  .then(user => res.json(user))
  .catch(err => res.json(err))
})

app.post('/login',(req, res)=>{
  const {email, password}= req.body;
  StudentModel.findOne({email})
  .then(user=>{
    if(user){
       if(user.password === password){
        const accessToken = jwt.sign({email: email}, "jwt-access-token-secret-key",{expiresIn: '1m'})
        const refreshToken = jwt.sign({email: email}, "jwt-refresh-token-secret-key",{expiresIn: '5m'})

        res.cookie('accessToken', accessToken,{maxAge: 60000})

        res.cookie('refreshToken', refreshToken,{maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict'})
        return res.json({login: true})
       }
    }else{
       res.json( {Login: false, message: 'no record'})
    }
  }).catch(err => res.json(err))
})

const verifyUser = (req, res, next)=>{
  const accesstoken = req.cookies.accessToken;
  if(!accesstoken){
       if(renewToken(req, res)){
        next()
       }
  }else{
    jwt.verify(accesstoken, 'jwt-access-token-secret-key', (err, decoded)=>{
      if(err){
         return res.json({valid: false, message: "Invalid Token"})
      }else{
        req.email = decoded.email
        next()
      }
    })
  }
}

const renewToken = (req, res) =>{
  const refreshtoken = req.cookies.refreshToken;
  let exist = false;
  if(!refreshtoken){
     return res.json({valid: false, message: "No Refresh token"})
  }else{
    jwt.verify(refreshtoken, 'jwt-refresh-token-secret-key', (err, decoded)=>{
      if(err){
         return res.json({valid: false, message: "Invalid Refresh Token"})
      }else{
        const accessToken = jwt.sign({email: decoded.email}, "jwt-access-token-secret-key",{expiresIn: '1m'})
        res.cookie('accessToken', accessToken,{maxAge: 60000})
        exist = true;
      }
    })
  }
  return exist;
}

app.get('/dashboard',verifyUser, (req, res )=>{
  return res.json({ valid: true, message: "authorised"})
})

app.listen(3001,()=>{
console.log("server is running");
})  