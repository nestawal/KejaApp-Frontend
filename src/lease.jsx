import { useState , useEffect} from 'react';
import {useLocation,useParams,useNavigate} from 'react-router-dom'
import axios from 'axios';

//finish request input functions  
export default function Lease(){
    const {id} = useParams()
    console.log(id);
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state?.formData;
    console.log("This is formData:",formData);
    const [post,setPost] = useState();
    console.log(post)
    const url = "https://kejaapp-backend.onrender.com";

        useEffect(()=>{
        const findPost = async() =>{
           
        try{     
          
       
            await axios.get(`${url}/Post/${id}`)
                .then(result=>{
                    const data = result.data
                    console.log(data)
                    setPost(data)
                })

        } catch (error) {
            
            console.error("Error fetching data:", error);
        }
           
        }

        findPost();
        console.log("This is the post:",post);
        

    },[id]);

    const [newReq,setNewReq] = useState({
        postId : id,
        personId : formData._id,
        months : 0
    })

    function handleChange(e){
        setNewReq(prev=>{
            return{
            ...prev,
            [e.target.name] : e.target.value 
            }
        })
        console.log("This is req",newReq)
    }

    function handleSubmit(e){
        e.preventDefault();

        if(newReq.months != 0){
            axios.patch(`${url}/requests/addNewreq`,{
                postId : newReq.postId,
                personId : newReq.personId,
                months : newReq.months,
                name : formData.name
            })
            .then(result=>{console.log(result)
                navigate("/requestSent",{state:{formData : formData}})
            })
            .catch(error=>console.log(error))
        }
    }

     if(!post || !post.posts){
        return <div>Loading lease ...</div>
    }

    return(
        <div>
            <div>
                <u><h1>Digital lease for request</h1></u>
                
                <p>
                    I,&nbsp;<strong>{`${formData.name}`}</strong>, hereby confirm my agreement to lease the residential property located at ,&nbsp; 
                    <strong>{`${post.posts.location}`}</strong> for the monthly rent of&nbsp;
                     <strong>ksh{`${post.posts.price}`}</strong>. 
                    This offer is made based on the current advertised terms and my satisfactory review of the property condition. 
                    I want to rent this property for&nbsp; <u><input type="number" id="rentMonths" name="months"  value={newReq.months} min="1" placeholder="input no of months" onChange={handleChange}  /></u> months until a renewal of lease contract can be finalized.
                </p>

                <button onClick={(e)=>handleSubmit(e)}>submit</button>
            </div>
        </div>
    )
}