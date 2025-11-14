import {React,useState} from "react";
import { Navigate,useNavigate } from 'react-router-dom';
import axios from "axios"


export  default function Signup(){

  const navigate = useNavigate()
  const url = "https://kejaapp-backend.onrender.com"
 
const [formData,setFormData] = useState({
  name:"",
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

function handleSubmit(e){
  e.preventDefault()
  axios.post(`${url}/identities/signup`,{
    name : formData.name,
    email: formData.email,
    password: formData.password
  })
  .then(result=>{console.log(result)
    navigate("/",{state: {user: formData}})
  })
  .catch(error=>console.log(error))

}



function goLogin(){
  navigate("/login")
}


 return(
    <div>
            
            <div className="container">
            <div className="form" onSubmit={handleSubmit}>
                <h1 id="title">Sign Up</h1>
                <form>
                <div className="input-group">
                    <div className="input-field" id="nameField">
                    <i className="fa-solid fa-envelope"></i>
                    <input
                    onChange={handleChange} 
                    type="text" 
                    placeholder="name" 
                    name="name"
                    value={formData.name}
                    />
                    </div>
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
                    <p>Lost password<a href="#">Click Here!</a></p>
                </div>
                <div className="btn-field">
                    <button type="submit" id="signupBtn">Sign Up</button>
                    <button type="button" id="signinBtn" onClick={goLogin}  >Sign in</button>
                    
                </div>
                </form>
            </div>
            
            </div>
            

    </div>
 )
}