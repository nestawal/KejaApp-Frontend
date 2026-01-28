import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewCard from "../components/newCard.jsx";
import axios from "axios";

export default function MyRequests() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Defaulting location state to prevent crashes
    const formData = location.state?.formData || {};
    console.log(formData)
    const cart = location.state?.cart || [];
    
    const [posts, setPosts] = useState([]);
    const url = "https://kejaapp-backend.onrender.com";
    //const url = "http://localhost:3001"
    const postLogOnly = false;

    // The fetch function is moved inside useEffect or wrapped in useCallback 
    // to avoid re-creation on every render, but here we'll keep it simple.
    const fetchMyRequests = () => {
        const id = formData._id;
        console.log("this is ID:",id)
        if (!id) return;

        axios.get(`${url}/requests/returnReq/${id}`)
            .then((response) => {
                setPosts(response.data);
            })
            .catch(err => console.error("Error fetching requests:", err));
    };

    useEffect(() => {
        // Using a timer as a safety buffer for route transitions
        const timer = setTimeout(() => {
            if (formData.email) {
                fetchMyRequests();
            }
        }, 100);

        // CLEANUP: Important to prevent memory leaks
        return () => clearTimeout(timer);
    }, [formData.email, formData._id]); 

    const cards = posts.map(item => {
    // FIX: Define postData first!
    const postData = item.newPost || item;
    console.log(item.acceptStatus)
    
    return (
        <NewCard
            key={postData._id}
            _id={postData._id}
            file={postData.file}
            description={postData.description}
            price={postData.price}
            title={postData.title}
            location={postData.location}
            isAdmin={false}
            personId={formData._id}
            hideRequest={true}
            propertyId={postData._id}
            canIpay={item.acceptStatus}
            formData={formData}
        />
    );
});

    return (
        <div>
            <h1>Your requests</h1>
            <section className="cards-list">
                {posts.length > 0 ? cards : <p>No requests found.</p>}
            </section>
        </div>
    );
}