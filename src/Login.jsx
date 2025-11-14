import {React,useState} from "react";
import { Navigate,useNavigate } from 'react-router-dom';
import axios from "axios"
import { useRef } from 'react';


export  default function Login(){
const navigate = useNavigate()
const url = "https://kejaapp-backend.onrender.com"
  

const [formData,setFormData] = useState({
  email:"",
  password:""
})

function handleChange(e){
  setFormData(prev=>{
    return{
      ...prev,
      [e.target.name] : e.target.value 
    }
  })
}
console.log(formData)

const goHome = () => {
    navigate("/main")
}

function handleSubmit(event){
  event.preventDefault()
  axios.post(`${url}/identities/login`,{
    name : formData.name,
    email: formData.email,
    password: formData.password
  })
  .then(result=>{
    console.log(result)
    if(result.data.status === "found"){
      navigate("/",{state: {user: result.data.person}})
      console.log("found")
    }else{
      navigate("/signUp")
      alert("please register, account not found")
      console.log("not found")
    }
  })
  .catch(error=>console.log(error))

}

 return(
    <div>
            
            <div className="container">
            <div className="form" onSubmit={handleSubmit}>
                <h1 id="title">Sign In</h1>
                <form>
                <div className="input-group">
                  
                    <div className="input-field">  
                    <i className="fa-solid fa-envelope"></i>
                    <input 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="email"
                    value={formData.email}
                    name="email" 
                    />
                    </div>
                    <div className="input-field">  
                    <i className="fa-solid fa-envelope"></i>
                    <input 
                    onChange={handleChange} 
                    name = "password"
                    type="password" 
                    value={formData.password}
                    placeholder="password"
                     />              
                    </div>
                   
                </div>
                <div className="btn-field">
                    <button type="submit" id="signinBtn"  >Login</button>
                    
                </div>
                </form>
            </div>
            
            </div>
            

    </div>
 )
}