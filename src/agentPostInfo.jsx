import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Payments from "./InfoRecord/postPayments.jsx";
import Accepted from "./InfoRecord/Accepted.jsx";
import Requests from "./InfoRecord/Requests.jsx";

export default function AgentPostInfo() {
    const location = useLocation();
    const formData = location.state || {};
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [Record, SetRecord] = useState("requests");
    const [postInfo, setPostInfo] = useState(null);
    const [requestInfo, setRequestInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const url = "https://kejaapp-backend.onrender.com";

    useEffect(() => {
        // Only fetch if we have an ID
        if (!id) {
            console.error("No ID provided in URL");
            setError("No property ID provided");
            return;
        }

        const findPost = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log("Fetching post with ID:", id);
                
                // 1. Fetch post data
                const postResponse = await axios.get(`${url}/Post/${id}`);
                console.log("Post data:", postResponse.data);
                setPost(postResponse.data);
                
                // 2. Fetch request data
                const requestResponse = await axios.get(`${url}/requests/getRequest/${id}`);
                console.log("Request data:", requestResponse.data);
                
                // Check if data exists
                if (requestResponse.data && requestResponse.data.requestedId) {
                    const { requestedId } = requestResponse.data;
                    
                    // Set request info (pending array)
                    setRequestInfo(requestedId.pending || []);
                    
                    // Set post info (the entire requestedId object)
                    setPostInfo(requestedId);
                    
                    console.log("Pending requests:", requestedId.pending);
                    console.log("Post info set:", requestedId);
                } else {
                    console.log("No request data found");
                    setRequestInfo([]);
                    setPostInfo(null);
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
                
                // If it's a 404, the post might not exist
                if (error.response?.status === 404) {
                    setError("Property not found");
                } else if (error.response?.status === 500) {
                    setError("Server error. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        findPost();
    }, [id]); // Only re-run when id changes

    function recordChoice(r) {
        SetRecord(r);
        console.log("Selected record:", r);
    }

    // Loading state
    if (loading) {
        return <div className="loading">Loading post information...</div>;
    }

    // Error state
    if (error) {
        return (
            <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
        );
    }

    // Check if post data is loaded
    if (!post || !post.posts) {
        return <div>Loading post information...</div>;
    }

    return (
        <div className="postInfo">
            <div className="postInfo--profile">
                {post.file ? (
                    <img 
                        src={`data:image/jpeg;base64,${post.file}`}  
                        className="postInfo--image" 
                        alt={post.posts.name}
                    />
                ) : (
                    <div className="postInfo--image-placeholder">No Image</div>
                )}
                <div className="postInfo--details">
                    <div className="postInfo--title">{post.posts.name}</div>
                    <div><strong>Rooms:</strong> {post.posts.rooms}</div>
                    <div><strong>Price:</strong> ksh {post.posts.price} p/m</div>
                    <div><strong>Location:</strong> {post.posts.location}</div>
                </div>
            </div>
            
            <div className="postInfo--choice">
                <button 
                    onClick={() => recordChoice("Requests")}
                    className={Record === "Requests" ? "active" : ""}
                >
                    Requests
                </button>
                <button 
                    onClick={() => recordChoice("Accepted")}
                    className={Record === "Accepted" ? "active" : ""}
                >
                    Accepted
                </button>
                <button 
                    onClick={() => recordChoice("Payments")}
                    className={Record === "Payments" ? "active" : ""}
                >
                    Payments
                </button>
            </div>
            
            {Record === "Requests" && (
                <Requests
                    info={requestInfo}
                    postInfo={postInfo ? [postInfo] : []} // Convert to array if needed
                />
            )}
            
            {Record === "Accepted" && postInfo && (
                <Accepted
                    postInfo={postInfo}
                />
            )}
            
            {Record === "Payments" && <Payments />}
        </div>
    );
}