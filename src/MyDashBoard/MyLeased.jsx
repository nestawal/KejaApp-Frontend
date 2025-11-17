import {React,useState,useEffect} from "react"
import {useLocation,useNavigate} from "react-router-dom"
import NewCard from "../components/newCard.jsx"
import axios from "axios"

export default function MyLeased(){
    const navigate = useNavigate()
    const location = useLocation()
    const formData = location.state?.formData || {};
    const [posts,setPosts] = useState([]);
    console.log(posts);
    console.log(formData)
    const id = formData._id
    const url = "https://kejaapp-backend.onrender.com"
    
    const cart = location.state?.cart || [];

    const postLogOnly = false ;
    console.log(postLogOnly);

    console.log("Before function",formData.email);
    const fetchMyRequests = () =>{
        console.log("Inside function",{x: formData.email,y: id})
       
        axios.get(`${url}/requests/returnLeased/${id}`)
        .then((response)=>{
            console.log(response.data);
            setPosts(response.data);
        })
        .catch(err => console.log("Error fetching data:", err));
    }

    useEffect(() => {
        setTimeout(() => {
        console.log(" After timeout - formData.email:", formData.email);
        if (formData.email) {
            fetchMyRequests();
        }
        }, 100);
    }, [formData.email]);
    //TODO : will change the post cards format later
    

   
    /*handle cart prperly to backend
    const[cart,setCart]= useState([])
        function handleCart(newItem){
                setCart(prev=>[
                    ...prev,
                    newItem
                ])
            
        }
        console.log(cart);
*/


    const cards = posts.map(item => (
            <NewCard
               key={item._id}
                {...item}
                postLogOnly = {postLogOnly}
                //cart={()=>handleCart(item)}
                file={item.newPost.file}
                description={item.newPost.posts.description}
                price={item.newPost.posts.price}
                title={item.newPost.posts.name}
                location={item.newPost.posts.location}
                isAdmin = {true}
                personId = {id}
                propertyId = {item.newPost._id}
                canIpay = {item.acceptStatus}
            />
        )
    );
    
    

    return(
        <div>
            <h1>Your leased</h1>
            <section className="cards-list">
                {cards}
               
            </section>
        </div>
    );
}