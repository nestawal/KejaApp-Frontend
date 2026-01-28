import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import NewCard from "../components/newCard.jsx"
import axios from "axios"

export default function MyLeased() {
    const navigate = useNavigate()
    const location = useLocation()
    const formData = location.state?.formData || {};
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const id = formData._id
    const url = "https://kejaapp-backend.onrender.com"
    
    useEffect(() => {
        if (!id) {
            setError("User not logged in");
            setLoading(false);
            return;
        }
        
        const fetchMyLeased = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/requests/returnLeased/${id}`);
                console.log("Leased properties:", response.data);
                setPosts(response.data);
            } catch (err) {
                console.error("Error fetching leased properties:", err);
                setError("Failed to load leased properties");
            } finally {
                setLoading(false);
            }
        };
        
        fetchMyLeased();
    }, [id]);
    
    if (loading) {
        return <div>Loading your leased properties...</div>;
    }
    
    if (error) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/")}>Go Home</button>
            </div>
        );
    }
    
    const cards = posts.map(item => {
        // Check data structure
        console.log("Item structure:", item);
        
        const postData = item.newPost || item;
        
        return (
            <NewCard
                key={postData._id}
                _id={postData._id}
                file={postData.file}
                description={postData.description}
                price={postData.price}
                title={postData.title || postData.name}
                location={postData.location}
                isAdmin={false} // User is tenant, not admin
                personId={id}
                propertyId={postData._id}
                canIpay={item.acceptStatus} // For recurring rent payments
                formData={formData}
                showRequestButton={false} // Already leased, can't request
            />
        );
    });
    
    return (
        <div>
            <h1>Your Leased Properties ({posts.length})</h1>
            
            {posts.length === 0 ? (
                <div className="no-leased">
                    <p>You haven't leased any properties yet.</p>
                    <button onClick={() => navigate("/browse")}>
                        Browse Properties
                    </button>
                </div>
            ) : (
                <section className="cards-list">
                    {cards}
                </section>
            )}
        </div>
    );
}