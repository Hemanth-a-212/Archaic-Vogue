import React, { useEffect, useRef, useState } from 'react'
import eye from "../Components/Assets/eye.png"
import eye_closed from "../Components/Assets/eye-closed.png"
import './css/LoginSignup.css';
import log_img from "../Components/Assets/login-img.jpg"

const LoginSignup = () => {
  const [showPwd,setShowPwd]=useState(false);
  const [state,setState]=useState("Login");
  const [data,setData]=useState({
    name:"",
    password:"",
    email:""
  })
  const LoginRef = useRef(null);
  const SignupRef = useRef(null);

useEffect(()=>{
  if(state==="Login" && LoginRef.current){
    LoginRef.current.focus();
  }else if(state==="Sign Up" && SignupRef.current){
    SignupRef.current.focus();
  }
},[state])

const login = async ()=>{
  let resData;
  await fetch("http://localhost:5000/login",{
    method:"POST",
    headers:{Accept:"application/form-data","Content-Type":"application/json"},
    body:JSON.stringify(data)
  }).then((res)=>res.json()).then((data)=>resData=data)

  if(resData.success){
    localStorage.setItem("auth-token",resData.token);
    window.location.replace("/");
  }else{
    alert(resData.errors);
  }
}

const signup = async ()=>{
  let resData;
  await fetch("http://localhost:5000/signup",{
    method:"POST",
    headers:{Accept:"application/form-data","Content-Type":"application/json"},
    body:JSON.stringify(data)
  }).then((res)=>res.json()).then((data)=>{console.log(data);resData=data;})

  if(resData.success){
    localStorage.setItem("auth-token",resData.token);
    window.location.replace("/");
  }else{
    alert(resData.errors);
  }
}

const changeData = async(e)=>{
  let {value,name}=e.target;
  setData((prev)=>{
    return {...prev,[name]:value}
  })
}

  return (
    <div className='loginsignup'>
      <div>
      <div className="login-img">
        <img src={log_img} alt="" />
      </div>
      <form className="cont" onSubmit={()=>state==="Login"?login():signup()}>
        <h1>{state}</h1>
        <div className="ls-fields">
          {state==='Sign Up'?<div className='field'>
            <p>Name</p>
            <input ref={SignupRef} onChange={changeData} name='name' value={data.name} type="text" placeholder='Name' required />
          </div>:<></>}
          <label className='field'>
            <p>Email</p>
            <input ref={LoginRef}  onChange={changeData} name='email' value={data.email} type="email" placeholder='Email' required/>
          </label>
          <div className='field'>
            <p>Password</p>
            <div className="password">
            <input onChange={changeData} name='password' value={data.password} type={showPwd?"text":"password"} placeholder='Password' required />
            <div className="eye" onClick={()=>setShowPwd((p)=>!p)}>{showPwd?<img src={eye} alt="" />:<img src={eye_closed} alt="" />}</div>
            </div>
          </div>
          
        </div>
        <div className='btn'><input type="submit" value="Continue"/></div>
        <div>
        {state==="Sign Up"?<p className='login-here'>Already have an account ?<span onClick={()=>{setState("Login")}}> Login here.</span></p>
        :<p className='login-here'>Create an account ?<span onClick={()=>{setState("Sign Up")}}> Click here.</span></p>}
        {state==="Sign Up"?<div className="agree">
        <input type="checkbox" required/>
        <p>By signing in, I agree to <span>Terms & Conditions</span> , and <span>Privacy Policy</span></p>
        </div>:<></>}
        </div>
      </form>
      </div>
    </div>
  )
}

export default LoginSignup
