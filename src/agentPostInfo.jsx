import React ,{useState,useEffect} from "react";
//import data from "./data.js"
import  {useParams,useLocation}  from "react-router-dom";
import axios from "axios";
import Payments from "./InfoRecord/postPayments.jsx";
import Accepted from "./InfoRecord/Accepted.jsx";
import Requests from "./InfoRecord/Requests.jsx";

export default function AgentPostInfo(){
    const location = useLocation();
     const formData = location.state || {};
    const {id} = useParams();
    const [post,setPost] = useState(null);
    const [Record,SetRecord] = useState("requests");
    const [postInfo,setPostInfo] = useState();
    const [requestInfo,setRequestInfo] = useState([]);
    console.log(requestInfo);
    
    const url = "https://kejaapp-backend.onrender.com"

    useEffect(()=>{
        const findPost = async() =>{
           
        try{     
          
       
        await axios.get(`${url}/Post/${id}`)
            .then(result=>{
                const data = result.data
                console.log(data)
                setPost(data)
            })

        await axios.get(`${url}/requests/getRequest/${id}`)
            .then(result=>{
                const data = result.data
                console.log("This is the pending:",data.requestedId.pending)
                setRequestInfo(prevState => {
                    const newState = data.requestedId.pending
                    console.log("Setting new state:", newState)
                    return newState
                })
                setPostInfo(prev=>{
                    const newState = data.requestedId
                    console.log("new postInfo:",newState)
                    return newState
                })
                console.log(requestInfo)
                console.log(requestInfo?.leased);
            })

        

       

        } catch (error) {
            
            console.error("Error fetching data:", error);
        }
           
        }

        findPost();
        console.log(post);
        

    },[id]);



    useEffect(() => {
    // This runs AFTER the state has been successfully updated by React
    if (requestInfo && requestInfo.pending) {
        console.log("requestInfo state is now updated:", requestInfo.pending);
    }
}, [requestInfo]);

    


    


    /**
     * TODAY'S WORK
     * instaed of creating multiple pages use this page 
     * have request table
     * money spent/earnt section
     * rented to who section also
     * lease section also
     */
   
    function recordChoice(r){
        SetRecord(r);
        console.log(Record);
    }

     if(!post || !post.posts){
        return <div>Loading post ...</div>
    }

    return(
        <div className="postInfo">
            <div className="postInfo--profile">
                <img 
                    src={`data:image/jpeg;base64,${post.file}`}  
                    className="postInfo--image" 
                />
                <div className="postInfo--details">
                    <div>{post.posts.name}</div>
                    <div><strong>rooms:</strong>{post.posts.rooms}</div>
                    <div>ksh {post.posts.price} p/m</div>
                    <div><strong>Location:</strong>{post.posts.location}</div>
                </div>
            </div>
            <div className="postInfo--choice">
                <button onClick={()=>recordChoice("Requests")}>requests</button>
                <button onClick={()=>recordChoice("Accepted")}>accepted</button>
                <button onClick={()=>recordChoice("Payments")}>payments</button>
            </div>
            {Record === "Requests"&& 
            <Requests
                info={requestInfo}
                postInfo={postInfo}
            />}
            {Record === "Accepted"&& 
            <Accepted
                 postInfo={postInfo}
            />}
            {Record === "Payments"&& <Payments/>}
            
        </div>
    )

}