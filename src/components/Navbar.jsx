import React,{useState,useEffect,useRef} from "react";
import { Navigate,useNavigate } from 'react-router-dom';
import {useLocation} from "react-router-dom"


export default function Navbar(props) {
    //const navigate = useNavigate()
    const menuRef = useRef(null);
    const location = useLocation();
    const cart = props.cart
    console.log(cart)

    

    
   
    console.log(props.show)
  

    const [isAdmin,setIsAdmin] = useState(false);
    if(props.fullname === 'admin'){
      setIsAdmin(prev => !prev)
    }
  
    return (
        <nav>
            <div className="navBrand">
                <img src="/src/images/logoKeja.png" className="nav--logo" />
                <h3 className="title">KEJA</h3>
            </div>
            <h3>{props.fullName}</h3>
            <div className="navFunctions">
                <button onClick={props.renderSearch} className="srchBtn">
                  <img   className="srchImg" src="/src/images/search.png" alt="" />
                </button>
                <div className="menu" id="menu" ref={menuRef}>
                    <button onClick={props.showSideBar} id="menu">-</button>
                    
                </div>
            </div>
        </nav>
    )
}
