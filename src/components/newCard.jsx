import React,{useState} from "react"
import { Link,useNavigate } from "react-router-dom"

const NewCard =(props) => {
    const navigate = useNavigate();
    console.log(props)
    console.log(props._id);
    console.log(props.postLogOnly)
    console.log(props.canIpay)

    let badgeText;
    if (props.openSpots === 0) {
        badgeText = "SOLD OUT"
    } else if (props.location === "Online") {
        badgeText = "ONLINE"
    }

    const [isListed,setListed] = useState(false)
    function weka(){
        setListed(prevState => !prevState)
        if(!isListed){
            props.cart();
        }
    
    } 

    const userStatus = props.isAdmin



    
    return (
        <div className="card">
            {
                badgeText && 
                <div className="card--badge">{badgeText}</div>
            }
            <img 
                src={`data:image/jpeg;base64,${props.file}`} 
                className="card--image" 
            />
            <div className="card--stats">
                <img src="/images/star.png" className="card--star" />
                {/*<span>{props.stats.rating}</span>*/}
                {/*<span className="gray">({props.stats.reviewCount}) • </span>*/}
                <span className="gray">{props.location}</span>
            </div>
            <p className="card--title">{props.title}</p>
            <p className="card--price">
                <span className="bold"><strong>ksh{props.price}</strong></span>
            </p>
            <div>
                {props.postLogOnly && <button onClick={weka}>{isListed ? "Listed":"List"}</button> }
                <button onClick={()=>{userStatus === true ? navigate(`/posts/agent/${props._id}`) : navigate(`/posts/${props._id}`)}}>...</button>
                {!userStatus && <button onClick={()=>navigate(`/request/${props._id}`,{state:{formData : props.formData}})}>request</button>}
                {props.canIpay && <button onClick={()=>navigate(`/pay/${props.propertyId}/${props.personId}/${props.price}`)}>Pay</button>}
            </div>
            
        </div>
    )
}

export default NewCard;