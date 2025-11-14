import React ,{useState,useEffect} from "react";
//import data from "./data.js"
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PostInfo(){
    const formData = location.state || {};
    const {id} = useParams();
    const [post,setPost] = useState(null);
    
    const url = "https://kejaapp-backend.onrender.com"

    useEffect(()=>{
        /*const foundPost = data.find(p=> p.id === Number(id));
        //we will change this from the dummy data to dynamic when we are done
        console.log(foundPost);
        setPost(foundPost);*/
        const findPost = async() =>{
            await axios.get(`${url}/Post/${id}`)
                .then(result=>{
                    const data = result.data
                    console.log(data)
                    setPost(data)
                })

           
        }

        findPost();
        console.log(post);
        

    },[id]);

    


    


    /**
     * TODAY'S WORK
     * instaed of creating multiple pages use this page 
     * have request table
     * money spent/earnt section
     * rented to who section also
     * lease section also
     */

    if(!post || !post.posts){
        return <div>Loading post ...</div>
    }

    return(
        <div className="postInfo">
            <img 
                src={`data:image/jpeg;base64,${post.file}`}  
                className="card--image" 
            />
            <div className="postDetails">
                <div>{post.posts.name}</div>
                <div><strong>rooms:</strong>{post.posts.rooms}</div>
                <div>ksh {post.posts.price}</div>
                <div className="detButtons">
                    <button>Rent</button>
                    <button>List</button>
                </div>
            </div>
            
        </div>
    )
}