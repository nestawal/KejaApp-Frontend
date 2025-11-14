import {React,useState} from "react"
import { Link } from "react-router-dom"

export default function SideBar(props){
    console.log(props.formData)
   
    return(
        <div className="SideSec">
            <Link to='signUp'><button >SignUp</button></Link>
            <Link to='/cart' state={props.formData}><button  >Cart</button></Link>
            <Link to='Dashboard' state={props.formData}><button>DashBoard</button></Link>
            <button>Log out</button>
        </div>
    )
}