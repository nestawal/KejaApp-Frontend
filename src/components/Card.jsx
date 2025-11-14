import React,{useState} from "react"
import { Link,useNavigate } from "react-router-dom"

const Card =(props) => {
    const navigate = useNavigate();
    console.log(props)
    console.log(props.id);
    console.log(props.postLogOnly)

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

    const formData = props.formData

    
    return (
        <div className="card">
            {
                badgeText && 
                <div className="card--badge">{badgeText}</div>
            }
            <img 
                src={`/src/images/${props.coverImg}`} 
                className="card--image" 
            />
            <div className="card--stats">
                <img src="/src/images/star.png" className="card--star" />
                <span>{props.stats.rating}</span>
                <span className="gray">({props.stats.reviewCount}) • </span>
                <span className="gray">{props.location}</span>
            </div>
            <p className="card--title">{props.title}</p>
            <p className="card--price">
                <span className="bold"><strong>ksh{props.price}</strong></span>
            </p>
            <div>
                {props.postLogOnly && <button onClick={weka}>{isListed ? "Listed":"List"}</button> }
                <button onClick={()=>navigate(`/posts/${props.id}`)}>...</button>
                <button>request</button>
            </div>
            
        </div>
    )
}

export default Card;