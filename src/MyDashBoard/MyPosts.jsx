import {React,useState,useEffect} from "react"
import {useLocation,useNavigate} from "react-router-dom"
import NewCard from "../components/newCard.jsx"
import axios from "axios"

export default function MyPosts(){
    const navigate = useNavigate()
    const location = useLocation()
    const formData = location.state?.formData || {};
    console.log(formData)
    const url = "https://kejaapp-backend.onrender.com"
    
    const cart = location.state?.cart || [];

    const postLogOnly = false ;
    console.log(postLogOnly);

    console.log("Before function",formData.email);
    const fetchMyposts = () =>{
        console.log("Inside function",formData.email)
       
        axios.post(`${url}/Post/yourPosts`,{email: formData.email })
        .then((response)=>{
            console.log(response.data.enrPosts);
            setPosts(response.data);
        })
        .catch(err => console.log("Error fetching data:", err));
    }
    useEffect(() => {
        setTimeout(() => {
        console.log(" After timeout - formData.email:", formData.email);
        if (formData.email) {
            fetchMyposts();
        }
        }, 100);
    }, [formData.email]);
    //TODO : will change the post cards format later
    

    const [posts,setPosts] = useState([]);
    console.log(posts);
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
                file={item.file}
                description={item.posts.description}
                price={item.posts.price}
                title={item.posts.name}
                location={item.posts.location}
                isAdmin = {true}
            />
        )
    );
    
    function addPostForm(){
        navigate("/addPost",{state:{formData}})
    };


    return(
        <div>
            <h1>Your posts</h1>
            <section className="cards-list">
                {cards}
                <button onClick={addPostForm}><img src="/images/plus.png" alt="add" /></button>
            </section>
        </div>
    );
}